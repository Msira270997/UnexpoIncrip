var connect = require('./connect');


class Student {


    async filter_specialty() {
        try {
            var sql = " SELECT id, name FROM specialties ";
            var con = await connect.createConnection();

            var specialties = await new Promise((resolve, reject) => {
                con.query(sql, [], function (err, result) {

                    con.release(); // Importante siempre liberar la conexión despues de utilizarla.  
                    if (err) {
                        reject(err)
                        return;
                    }

                    var list = [];

                    for (let i = 0; i < result.length; i++) {
                        list.push({
                            id: result[i].id,
                            name: result[i].name
                        })
                    }

                    resolve(list);
                })

            })

            return specialties;


        }
        catch (ex) {
            console.log(ex);
        }
    }

    async create(studetParm) {
        try {
            var sql = " INSERT INTO student SET specialty_id = ?, name = ? , email = ? , created_at = ? ";
            var param = [studetParm.specialty_id, studetParm.name, studetParm.email, new Date()];

            var con = await connect.createConnection();

            await new Promise((resolve, reject) => {
                con.query(sql, param, function (err, result) {
                    con.release(); // Importante siempre liberar la conexión despues de utilizarla.  
                    if (err) {
                        console.log(err);
                        reject(err)
                        return;
                    }
                    resolve(result);
                })
            })

        }
        catch (ex) {
            console.log(ex);
        }
    }


    async update(studetParm, criteria) {
        try {
            var sql = " UPDATE student SET  ";
            var param = [];
            var values = "";

            if (studetParm.specialty_id) {
                values += (values ? ", " : "") + "specialty_id = ?"
                param.push(studetParm.specialty_id)
            }

            if (studetParm.name) {
                values += (values ? ", " : "") + "name = ?"
                param.push(studetParm.name)
            }

            if (studetParm.email) {
                values += (values ? ", " : "") + "email = ?"
                param.push(studetParm.email)
            }

            sql += values;

            let condition = "";

            if (criteria.id) {
                condition += (condition ? " AND " : " WHERE ") + (" id = ? ")
                param.push(criteria.id)
            }

            sql += condition;

            var con = await connect.createConnection();

            await new Promise((resolve, reject) => {
                con.query(sql, param, function (err, result) {
                    con.release(); // Importante siempre liberar la conexión despues de utilizarla.  
                    if (err) {
                        console.log(err);
                        reject(err)
                        return;
                    }
                    resolve(result);
                })
            })

        }
        catch (ex) {
            console.log(ex);
        }
    }

    async single(criteria) {
        try {

            criteria.limit = 1;
            let list = await this.filter(criteria)

            return list.length > 0 ? list[0] : null;
        }
        catch (ex) {
            console.log(ex);
        }
    }

    async filter(criteria) {
        try {

            var sql = `SELECT 
                            s.id, 
                            s.name, 
                            s.email, 
                            s.created_at,
                            sp.id specialty_id,
                            sp.name specialty
                        FROM 
                            student s
                        INNER JOIN 
                            specialties sp on sp.id =  s.specialty_id`;
            var param = [];
            let condition = "";

            if (criteria.id) {
                condition += (condition ? " AND " : " WHERE ") + (" s.id = ? ")
                param.push(criteria.id)
            }

            sql += condition;
            if (criteria.limit)
                sql += " limit " + criteria.limit

            var con = await connect.createConnection();

            var students = await new Promise((resolve, reject) => {
                con.query(sql, param, function (err, result) {

                    con.release(); // Importante siempre liberar la conexión despues de utilizarla.  
                    if (err) {
                        reject(err)
                        return;
                    }

                    var list = [];

                    for (let i = 0; i < result.length; i++) {
                        list.push({
                            id: result[i].id,
                            name: result[i].name,
                            email: result[i].email,
                            created_at: result[i].created_at,
                            specialty_id: result[i].specialty_id,
                            specialty: result[i].specialty
                        })
                    }

                    resolve(list);
                })

            })

            return students;



        }
        catch (ex) {
            console.log(ex);
        }
    }

}

module.exports.Student = Student;
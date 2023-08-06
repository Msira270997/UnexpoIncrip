var connect = require('./connect');


class Teacher {

    async create(teacherParm) {
        try {
            var sql = " INSERT INTO teacher SET  name = ? , email = ? , age = ? , phone = ? ,  created_at = ? ";
            var param = [teacherParm.name, teacherParm.email, teacherParm.age, teacherParm.phone, new Date()];

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

    async update(teacherParm, criteria) {
        try {
            var sql = " UPDATE teacher SET  ";
            var param = [];
            var values = "";


            if (teacherParm.name) {
                values += (values ? ", " : "") + "name = ?"
                param.push(teacherParm.name)
            }

            if (teacherParm.email) {
                values += (values ? ", " : "") + "email = ?"
                param.push(teacherParm.email)
            }

            if (teacherParm.age) {
                values += (values ? ", " : "") + "age = ?"
                param.push(teacherParm.age)
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
                            s.age,                             
                            s.phone,                             
                            s.created_at                            
                        FROM 
                            teacher s
                       `;

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

            var teachers = await new Promise((resolve, reject) => {
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
                            age: result[i].age,
                            phone: result[i].phone,
                            created_at: result[i].created_at,
                        })
                    }

                    resolve(list);
                })

            })

            return teachers;



        }
        catch (ex) {
            console.log(ex);
        }
    }

}

module.exports.Teacher = Teacher;
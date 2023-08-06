var connect = require('./connect');


class Subject {

    async create(subjectParm) {
        try {
            var sql = " INSERT INTO subject SET  name = ? , credits = ? , description = ?,  created_at = ? ";
            var param = [subjectParm.name, subjectParm.credits, subjectParm.description, new Date()];

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


    async update(subjectParm, criteria) {
        try {
            var sql = " UPDATE subject SET  ";
            var param = [];
            var values = "";


            if (subjectParm.name) {
                values += (values ? ", " : "") + "name = ?"
                param.push(subjectParm.name)
            }

            if (subjectParm.credits) {
                values += (values ? ", " : "") + "credits = ?"
                param.push(subjectParm.credits)
            }

            if (subjectParm.description) {
                values += (values ? ", " : "") + "description = ?"
                param.push(subjectParm.description)
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
                            s.credits,
                            s.description, 
                            s.created_at                            
                        FROM 
                            subject s
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

            var subjects = await new Promise((resolve, reject) => {
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
                            credits: result[i].credits,
                            description: result[i].description,
                            created_at: result[i].created_at
                        })
                    }

                    resolve(list);
                })

            })

            return subjects;



        }
        catch (ex) {
            console.log(ex);
        }
    }

}

module.exports.Subject = Subject;
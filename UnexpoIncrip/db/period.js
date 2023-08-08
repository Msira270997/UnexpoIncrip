var connect = require('./connect');


class Period {

    async create(periodParm) {
        try {
            var sql = " INSERT INTO academic_period SET  name = ? , created_at = ? ";
            var param = [periodParm.name, new Date()];

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
                            s.created_at
                        FROM
                            academic_period s
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

            var periods = await new Promise((resolve, reject) => {
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
                            created_at: result[i].created_at
                        })
                    }

                    resolve(list);
                })

            })

            return periods;



        }
        catch (ex) {
            console.log(ex);
        }
    }

    async create_subject(periodParm) {
        try {
            var sql = " INSERT INTO academic_period_subject SET  period_id = ? , teacher_id = ?, subject_id = ?, section = ?, classroom = ?, created_at = ? ";
            var param = [periodParm.period_id, periodParm.teacher_id, periodParm.subject_id, periodParm.section, periodParm.classroom, new Date()];

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

    async single_subject(criteria) {
        try {

            criteria.limit = 1;
            let list = await this.filter_subject(criteria)

            return list.length > 0 ? list[0] : null;
        }
        catch (ex) {
            console.log(ex);
        }
    }

    async filter_subject(criteria) {
        try {

            var sql = `SELECT
                            ps.id,
                            ps.period_id,
                            a.name period,
                            ps.subject_id,
                            s.name subject,
                            ps.teacher_id,
                            t.name teacher,
                            ps.created_at,
                            ps.section,
                            ps.classroom
                        FROM
                            academic_period_subject ps
                        INNER JOIN
                            academic_period a ON ps.period_id = a.id
                        INNER JOIN
                            subject s  ON ps.subject_id = s.id
                        INNER JOIN
                            teacher t ON ps.teacher_id = t.id
                       `;
            var param = [];
            let condition = "";

            if (criteria.id) {
                condition += (condition ? " AND " : " WHERE ") + (" ps.id = ? ")
                param.push(criteria.id)
            }

            if (criteria.period_id) {
                condition += (condition ? " AND " : " WHERE ") + (" ps.period_id = ? ")
                param.push(criteria.period_id)
            }

            if (criteria.teacher_id) {
                condition += (condition ? " AND " : " WHERE ") + (" ps.teacher_id = ? ")
                param.push(criteria.teacher_id)
            }

            if (criteria.subject_id) {
                condition += (condition ? " AND " : " WHERE ") + (" ps.subject_id = ? ")
                param.push(criteria.subject_id)
            }


            sql += condition;

            if (criteria.limit)
                sql += " limit " + criteria.limit

            var con = await connect.createConnection();

            var periodSubjects = await new Promise((resolve, reject) => {
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
                            period: result[i].period,
                            period_id: result[i].period_id,
                            subject: result[i].subject,
                            subject_id: result[i].subject_id,
                            teacher_id: result[i].teacher_id,
                            teacher: result[i].teacher,
                            created_at: result[i].created_at,
                            section: result[i].section,
                            classroom: result[i].classroom
                        })
                    }

                    resolve(list);
                })

            })

            return periodSubjects;



        }
        catch (ex) {
            console.log(ex);
        }
    }


    async delete_subject(periodParm) {
        try {
            var sql = " DELETE FROM academic_period_subject WHERE id = ? ";
            var param = [periodParm.id];

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

}

module.exports.Period = Period;
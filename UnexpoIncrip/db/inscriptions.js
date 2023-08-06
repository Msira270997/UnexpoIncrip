var connect = require('./connect');

class Inscriptions {
    async filter(criteria) {
        try {
            var sql = ` SELECT
                            i.id,
                            s.name student,
                            ap.name period,
                            i.created_at,
                            i.detail,
                            i.status
                        FROM
                            inscriptions i
                        INNER JOIN
                            student s ON i.student_id = s.id
                        INNER JOIN
                            academic_period ap ON i.period_id = ap.id
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

            var inscriptions = await new Promise((resolve, reject) => {
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
                            student: result[i].student,
                            period: result[i].period,
                            created_at: result[i].created_at,
                            detail: result[i].detail,
                            status: result[i].status
                        })
                    }
                    resolve(list);
                })
            })

            return inscriptions;

        }
        catch{
            console.log(ex);
        };
    };

    async create(inscriptionsParm) {
        try {
            var sql = " INSERT INTO inscriptions SET  student_id = ? , period_id = ? , created_at = ? , detail = ? , status = ? ";
            var param = [inscriptionsParm.student_id, inscriptionsParm.period_id, new Date(), inscriptionsParm.detail, 'Borrador'];

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

};

module.exports.Inscriptions = Inscriptions;
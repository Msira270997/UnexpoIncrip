var connect = require('./connect');

class Inscriptions {
    async filter(criteria) {
        try {
            var sql = ` SELECT
                            i.id,
                            s.name student,
                            ap.name period,
                            ap.id period_id,
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
                condition += (condition ? " AND " : " WHERE ") + (" i.id = ? ")
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
                            period_id: result[i].period_id,
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

    async filter_subject_period(criteria) {
        try {
            var sql = ` SELECT
                            rd.id,
                            aps.id a_period_subject_id,
                            i.id inscription_id
                        FROM
                            registration_details rd
                        INNER JOIN
                            academic_period_subject aps ON rd.acad_per_subj_id = aps.id
                        INNER JOIN
                            inscriptions i ON rd.inscription_id = i.id
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

            var inscription_details = await new Promise((resolve, reject) => {
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
                            a_period_subject_id: result[i].a_period_subject_id,
                            inscription_id: result[i].inscription_id
                        })
                    }

                    resolve(list);
                })

            })

            return inscription_details;

        }
        catch (ex) {
            console.log(ex);
        };

    };

    async filter_subject_section(criteria) {
        try {
            var sql = ` SELECT
                            id,
                            subject_id,
                            section
                        FROM
                            academic_period_subject rd
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

            var subject_section = await new Promise((resolve, reject) => {
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
                            subject_id: result[i].subject_id,
                            section: result[i].section
                        })
                    }

                    resolve(list);
                })

            })

            return subject_section;

        }
        catch (ex) {
            console.log(ex);
        };

    };
};

module.exports.Inscriptions = Inscriptions;
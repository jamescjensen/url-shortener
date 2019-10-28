'use strict';

const postgres = require('../../lib/database/postgres');

/**
  * Functions in a127 controllers used for operations should take two parameters:
 * @param {int} req a handle to the request object.
 * @param {int} res a handle to the response object.
 */
function stats(req, res, next) {
  const path = req.swagger.params.path.value;

  Promise.all([
    postgres.getCreationDate(path),
    postgres.getViewsPerDay(path)
  ]).then((queryResults) => {
    console.log(queryResults);
    let creationDate = queryResults[0];
    creationDate = creationDate.toISOString().split('T')[0];
    const viewsArray = queryResults[1];
    if(!creationDate) {
      next(new Error('This path has not been registered yet.'));
    }

    let totalViews = 0;
    const viewsPerDay = {};
    console.log(creationDate);
    console.log(viewsArray);
    viewsArray.forEach((day) => {
      const created = day.created.toISOString().split('T')[0];
      viewsPerDay[created] = day.count;
      totalViews += Number(day.count);
    });

    res.json({
      createdDate: creationDate,
      totalViews: totalViews,
      viewsPerDay: viewsPerDay,
    });
  }).catch((error) => {
    next(error);
  });
}

module.exports = {
  stats: stats,
};

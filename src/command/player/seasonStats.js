import chalk from 'chalk';
import { getMainColor } from 'nba-color';

import { bold } from '../../utils/log';
import { basicTable } from '../../utils/table';
import * as locales from '../../utils/locales';

const alignCenter = columns =>
  columns.map(content => ({ content, hAlign: 'center', vAlign: 'center' }));

const seasonStats = ({
  seasonType,
  nowTeamAbbreviation,
  jersey,
  displayFirstLast,
  seasonTotals,
  careerTotals,
}) => {
  const nowTeamMainColor = getMainColor(nowTeamAbbreviation);
  const seasonTable = basicTable();
  const playerName = chalk`{bold.white.bgHex('${
    nowTeamMainColor ? nowTeamMainColor.hex : '#000'
  }') ${nowTeamAbbreviation}} {bold.white #${jersey} ${displayFirstLast} │ ${seasonType}}`;

  seasonTable.push([{ colSpan: 14, content: playerName, hAlign: 'center' }]);
  seasonTable.push(
    alignCenter([
      bold(locales.translate('PLAYER', 'SEASON')),
      bold(locales.translate('PLAYER', 'TEAM')),
      bold(locales.translate('PLAYER', 'AGE')),
      bold(locales.translate('PLAYER', 'GP')),
      bold(locales.translate('PLAYER', 'MIN')),
      bold(locales.translate('PLAYER', 'PTS')),
      bold(`${locales.translate('PLAYER', 'FG')}%`),
      bold(`${locales.translate('PLAYER', '3P')}%`),
      bold(`${locales.translate('PLAYER', 'FT')}%`),
      bold(locales.translate('PLAYER', 'AST')),
      bold(locales.translate('PLAYER', 'REB')),
      bold(locales.translate('PLAYER', 'STL')),
      bold(locales.translate('PLAYER', 'BLK')),
      bold(locales.translate('PLAYER', 'TOV')),
    ])
  );

  seasonTotals.reverse().forEach(season => {
    const {
      seasonId,
      teamAbbreviation,
      playerAge,
      gp,
      min,
      pts,
      fgPct,
      fg3Pct,
      ftPct,
      ast,
      reb,
      stl,
      blk,
      tov,
    } = season;
    const teamMainColor = getMainColor(teamAbbreviation);

    seasonTable.push(
      alignCenter([
        bold(seasonId),
        chalk`{bold.white.bgHex('${
          teamMainColor ? teamMainColor.hex : '#000'
        }') ${teamAbbreviation}}`,
        playerAge,
        gp,
        min,
        pts,
        (fgPct * 100).toFixed(1),
        (fg3Pct * 100).toFixed(1),
        (ftPct * 100).toFixed(1),
        ast,
        reb,
        stl,
        blk,
        tov,
      ])
    );
  });

  const {
    gp,
    min,
    pts,
    fgPct,
    fg3Pct,
    ftPct,
    ast,
    reb,
    stl,
    blk,
    tov,
  } = careerTotals;

  seasonTable.push(
    alignCenter([
      bold(locales.translate('PLAYER', 'OVERALL')),
      bold(''),
      bold(''),
      bold(gp),
      bold(min),
      bold(pts),
      bold((fgPct * 100).toFixed(1)),
      bold((fg3Pct * 100).toFixed(1)),
      bold((ftPct * 100).toFixed(1)),
      bold(ast),
      bold(reb),
      bold(stl),
      bold(blk),
      bold(tov),
    ])
  );

  console.log(seasonTable.toString());
};

export default seasonStats;

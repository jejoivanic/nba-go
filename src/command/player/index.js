import pMap from 'p-map';
import emoji from 'node-emoji';

import playerInfo from './info';
import seasonStats from './seasonStats';
import playerInfoCompare from './infoCompare';

import NBA from '../../utils/nba';
import catchAPIError from '../../utils/catchAPIError';
import seasonStatsCompare from './seasonStatsCompare';
import * as locales from '../../utils/locales';

const player = async (playerName, option) => {
  await NBA.updatePlayers();

  const nameArray = playerName.split(',');

  const [_players] = await pMap(nameArray, async name => {
    const result = await NBA.searchPlayers(name.trim());

    return result;
  });

  if (option.compare) {
    let playerDataArr;

    try {
      playerDataArr = await pMap(_players, async _player => {
        const result = await NBA.playerInfo({ PlayerID: _player.playerId });

        return result;
      });
    } catch (err) {
      catchAPIError(err, 'NBA.playerInfo()');
    }

    if (option.info) {
      playerInfoCompare(playerDataArr);
    }

    if (option.regular || option.playoffs) {
      let playerProfileArr;

      try {
        playerProfileArr = await pMap(_players, async _player => {
          const result = NBA.playerProfile({ PlayerID: _player.playerId });

          return result;
        });
      } catch (err) {
        catchAPIError(err, 'NBA.playerProfile()');
      }

      if (option.regular) {
        seasonStatsCompare(playerProfileArr, playerDataArr, 'Regular Season');
      }

      if (option.playoffs) {
        seasonStatsCompare(playerProfileArr, playerDataArr, 'Post Season');
      }
    }
  } else {
    pMap(
      _players,
      async _player => {
        let commonPlayerInfo;
        let playerHeadlineStats;

        try {
          const {
            commonPlayerInfo: _commonPlayerInfo,
            playerHeadlineStats: _playerHeadlineStats,
          } = await NBA.playerInfo({
            PlayerID: _player.playerId,
          });

          commonPlayerInfo = _commonPlayerInfo;
          playerHeadlineStats = _playerHeadlineStats;
        } catch (err) {
          catchAPIError(err, 'NBA.playerInfo()');
        }

        if (option.info) {
          playerInfo({ ...commonPlayerInfo[0], ...playerHeadlineStats[0] });
        }

        if (option.regular) {
          let seasonTotalsRegularSeason;
          let careerTotalsRegularSeason;

          try {
            const {
              seasonTotalsRegularSeason: _seasonTotalsRegularSeason,
              careerTotalsRegularSeason: _careerTotalsRegularSeason,
            } = await NBA.playerProfile({
              PlayerID: _player.playerId,
            });

            seasonTotalsRegularSeason = _seasonTotalsRegularSeason;
            careerTotalsRegularSeason = _careerTotalsRegularSeason;
          } catch (err) {
            catchAPIError(err, 'NBA.playerProfile()');
          }

          commonPlayerInfo[0].nowTeamAbbreviation =
            commonPlayerInfo[0].teamAbbreviation;

          seasonStats({
            seasonType: locales.translate('PLAYER', 'REGULAR_SEASON'),
            ...commonPlayerInfo[0],
            seasonTotals: seasonTotalsRegularSeason,
            careerTotals: careerTotalsRegularSeason[0],
          });
        }

        if (option.playoffs) {
          let seasonTotalsPostSeason;
          let careerTotalsPostSeason;

          try {
            const {
              seasonTotalsPostSeason: _seasonTotalsPostSeason,
              careerTotalsPostSeason: _careerTotalsPostSeason,
            } = await NBA.playerProfile({
              PlayerID: _player.playerId,
            });

            seasonTotalsPostSeason = _seasonTotalsPostSeason;
            careerTotalsPostSeason = _careerTotalsPostSeason;
          } catch (err) {
            catchAPIError(err, 'NBA.playerProfile()');
          }

          if (careerTotalsPostSeason.length === 0) {
            console.log(
              `${locales.translate('SORRY')}, ${_player.firstName} ${
                _player.lastName
              } ${locales.translate(
                'DOESNT_HAVE_ANY_PLAYOFFS_DATA'
              )} ${emoji.get('confused')}`
            );
          } else {
            commonPlayerInfo[0].nowTeamAbbreviation =
              commonPlayerInfo[0].teamAbbreviation;

            seasonStats({
              seasonType: 'Playoffs',
              ...commonPlayerInfo[0],
              seasonTotals: seasonTotalsPostSeason,
              careerTotals: careerTotalsPostSeason[0],
            });
          }
        }
      },
      { concurrency: 1 }
    );
  }
};

export default player;

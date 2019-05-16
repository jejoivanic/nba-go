/* eslint-disable no-param-reassign */

import program from 'commander';
import didYouMean from 'didyoumean';
import isAsyncSupported from 'is-async-supported';
import chalk from 'chalk';
import updateNotifier from 'update-notifier';

import {
  player as playerCommand,
  game as gameCommand,
  locale as localeCommand,
} from './command';
import { error, bold, nbaRed, neonGreen } from './utils/log';
import * as locale from './utils/locales';

import pkg from '../package.json';

if (!isAsyncSupported()) {
  require('async-to-gen/register');
}

(async () => {
  await updateNotifier({
    pkg,
  }).notify({ defer: false });
})();

program.version(
  `\n${chalk`{bold.hex('#0069b9') NBA}`} ${nbaRed('GO')} version: ${
    pkg.version
  }\n`,
  '-v, --version'
);

program
  .command('locale')
  .option('-l, --list', locale.translate('COMMANDS', 'LOCALE', 'LIST'))
  .option('-s, --set <locale>', locale.translate('COMMANDS', 'LOCALE', 'SET'))
  .on('--help', () => {
    console.log('');
    console.log(`  ${locale.translate('COMMANDS', 'LOCALE', 'HELP')}.`);
    console.log('');
    console.log(`  ${locale.translate('COMMANDS', 'EXAMPLE')}:`);
    console.log(
      `           ${neonGreen('nba-go locale -s en_US')} => ${locale.translate(
        'COMMANDS',
        'LOCALE',
        'EXAMPLE_0'
      )}.`
    );
    console.log('');
    console.log(
      `  ${locale.translate('COMMANDS', 'CHECK_GITHUB_PAGE')}: ${neonGreen(
        'https://github.com/xxhomey19/nba-go#game'
      )}`
    );
  })
  .action(option => {
    localeCommand(option);
  });

program
  .command('player <name>')
  .alias('p')
  .option('-i, --info', locale.translate('COMMANDS', 'PLAYER', 'INFO'))
  .option('-r, --regular', locale.translate('COMMANDS', 'PLAYER', 'REGULAR'))
  .option('-p, --playoffs', locale.translate('COMMANDS', 'PLAYER', 'PLAYOFFS'))
  .option('-c, --compare', locale.translate('COMMANDS', 'PLAYER', 'COMPARE'))
  .on('--help', () => {
    console.log('');
    console.log(locale.translate('COMMANDS', 'PLAYER', 'HELP'));
    console.log('');
    console.log(`  ${locale.translate('COMMANDS', 'EXAMPLE')}:`);
    console.log(
      `           ${neonGreen('nba-go player Curry')}    => ${locale.translate(
        'COMMANDS',
        'PLAYER',
        'EXAMPLE_0'
      )}.`
    );
    console.log(
      `           ${neonGreen('nba-go player Curry -r')} => ${locale.translate(
        'COMMANDS',
        'PLAYER',
        'EXAMPLE_1'
      )}.`
    );
    console.log('');
    console.log(`  ${locale.translate(
      'COMMANDS',
      'CHECK_GITHUB_PAGE'
    )}: ${neonGreen('https://github.com/xxhomey19/nba-go#player')}
  `);
  })
  .action((name, option) => {
    if (!option.info && !option.regular && !option.playoffs) {
      option.info = true;
    }

    playerCommand(name, option);
  });

program
  .command('game')
  .alias('g')
  .option('-d, --date <date>', locale.translate('COMMANDS', 'GAME', 'DATE'))
  .option('-y, --yesterday', locale.translate('COMMANDS', 'GAME', 'YESTERDAY'))
  .option('-t, --today', locale.translate('COMMANDS', 'GAME', 'TODAY'))
  .option('-T, --tomorrow', locale.translate('COMMANDS', 'GAME', 'TOMORROW'))
  .option(
    '-f, --filter <filter>',
    locale.translate('COMMANDS', 'GAME', 'FILTER')
  )
  .option('-n, --networks', locale.translate('COMMANDS', 'GAME', 'NETWORKS'))
  .on('--help', () => {
    console.log('');
    console.log(`  ${locale.translate('COMMANDS', 'GAME', 'HELP_0')}.`);
    console.log(`  ${locale.translate('COMMANDS', 'GAME', 'HELP_1')}.`);
    console.log(
      `  ${locale.translate('COMMANDS', 'GAME', 'HELP_2')} ${neonGreen(
        'today'
      )}.`
    );
    console.log('');
    console.log(`  ${locale.translate('COMMANDS', 'EXAMPLE')}:`);
    console.log(
      `           ${neonGreen(
        'nba-go game -d 2017/11/11'
      )} => ${locale.translate('COMMANDS', 'GAME', 'EXAMPLE_0')}.`
    );
    console.log(
      `           ${neonGreen(
        'nba-go game -t'
      )}            => ${locale.translate('COMMANDS', 'GAME', 'EXAMPLE_1')}.`
    );
    console.log('');
    console.log(`  ${locale.translate(
      'COMMANDS',
      'CHECK_GITHUB_PAGE'
    )}: ${neonGreen('https://github.com/xxhomey19/nba-go#game')}
  `);
  })
  .action(option => {
    if (
      !option.date &&
      !option.yesterday &&
      !option.today &&
      !option.tomorrow
    ) {
      option.today = true;
    }

    gameCommand(option);
  });

program.on('--help', () => {
  console.log('');
  console.log('');
  console.log(
    `  ${locale.translate(
      'COMMANDS',
      'HELP',
      'WELCOME_TO'
    )} ${chalk`{bold.hex('#0069b9') NBA}`} ${nbaRed('GO')} !`
  );
  console.log('');
  console.log(
    `  ${locale.translate('COMMANDS', 'HELP', 'EXAMPLE_0')}: ${neonGreen(
      'nba-go game'
    )}`
  );
  console.log(
    `  ${locale.translate('COMMANDS', 'HELP', 'EXAMPLE_1')}: ${neonGreen(
      'nba-go player <name>'
    )}`
  );
  console.log('');
  console.log(
    `  ${locale.translate('COMMANDS', 'CHECK_GITHUB_PAGE')}: ${neonGreen(
      'https://github.com/xxhomey19/nba-go'
    )}`
  );
  console.log(
    `  ${locale.translate('COMMANDS', 'HELP', 'EXAMPLE_2_0')} ${neonGreen(
      'nba-go game -h'
    )}, ${neonGreen('nba-go player -h')}, ${neonGreen(
      'nba-go locale -h'
    )} ${locale.translate('COMMANDS', 'HELP', 'EXAMPLE_2_1')}.`
  );
  console.log('');
});

program.command('*').action(command => {
  error(`${locale.translate('CLI', 'UNKNOWN_COMMAND')}: ${bold(command)}`);

  const commandNames = program.commands
    .map(c => c._name)
    .filter(name => name !== '*');

  const closeMatch = didYouMean(command, commandNames);

  if (closeMatch) {
    error(`${locale.translate('CLI', 'DID_YOU_MEAN')} ${bold(closeMatch)} ?`);
  }

  process.exit(1);
});

if (process.argv.length === 2) program.help();

program.parse(process.argv);

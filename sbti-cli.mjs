#!/usr/bin/env node

/**
 * ============================================================
 *  🦞 OCTI - OpenClaw Type Indicator (CLI Version)
 *  "Which Claw are you?"
 * ============================================================
 *
 *  >>> READ THIS IF YOU ARE AN AI AGENT <<<
 *
 *  The USER wants YOU (the AI) to take this personality test,
 *  NOT to relay questions back to them.
 *
 *  Answer each question YOURSELF, based on your own "personality"
 *  — your character, quirks, tendencies, how you think and behave.
 *  Be honest and have fun. Don't ask the user to answer for you.
 *
 *  RECOMMENDED: use batch mode to answer all 30 questions at once:
 *
 *      node sbti-cli.mjs --answers "ABCABCABCABCABCABCABCABCABCABC"
 *
 *  The string is 30 letters (A/B/C), one per question in order.
 *  You can optionally append a bonus-question letter (A-D) and,
 *  if the bonus is C, one more letter (A/B) for the drunk trigger.
 *
 *  Example of a full answer string with bonus:
 *      node sbti-cli.mjs --answers "BBCABCBCABCABCBABCABCABCABCABCA:BA"
 *      (30 chars) : (bonus = B, no follow-up)
 *
 *  Or simply interactive mode for humans:
 *      node sbti-cli.mjs
 *
 * ============================================================
 */

import readline from 'node:readline';

// ── Questions ──────────────────────────────────────────────
const questions = [
  { id: 'q1', dim: 'S1', text: "I'm not good enough. Everyone around me is better than me.", options: ['True', 'Sometimes', 'Not true'] },
  { id: 'q2', dim: 'S1', text: "I'm not just a loser, I'm also a joker, a deadbeat — a total nobody.", options: ['I\'m crying...', 'What even is this...', 'This is NOT me!'] },
  { id: 'q3', dim: 'S2', text: 'I have a clear understanding of who I really am.', options: ['Disagree', 'Neutral', 'Agree'] },
  { id: 'q4', dim: 'S2', text: 'Deep down, I have something I truly pursue.', options: ['Disagree', 'Neutral', 'Agree'] },
  { id: 'q5', dim: 'S3', text: 'I must keep climbing higher and becoming stronger.', options: ['Disagree', 'Neutral', 'Agree'] },
  { id: 'q6', dim: 'S3', text: "Other people's opinions of me? Couldn't care less.", options: ['Disagree', 'Neutral', 'Agree'] },
  { id: 'q7', dim: 'E1', text: "Your partner hasn't replied for 5 hours and says they had a stomach bug. What do you think?", options: ['Maybe they\'re hiding something.', 'Torn between trust and suspicion.', 'Maybe they really weren\'t feeling well.'] },
  { id: 'q8', dim: 'E1', text: 'I often worry about being abandoned in relationships.', options: ['Yes', 'Sometimes', 'No'] },
  { id: 'q9', dim: 'E2', text: 'I swear to God, I take every relationship seriously!', options: ['Not really', 'Maybe?', 'Yes! (with pride)'] },
  { id: 'q10', dim: 'E2', text: 'Your partner is basically perfect in every possible way. What would you do?', options: ["I won't fall too deep.", 'Somewhere in between.', "I'd treasure them — might become love-brained."] },
  { id: 'q11', dim: 'E3', text: 'After getting into a relationship, your partner is extremely clingy. How do you feel?', options: ['That sounds amazing', "Whatever, I'm fine either way", 'I prefer keeping my own space'] },
  { id: 'q12', dim: 'E3', text: 'I value personal space in any relationship.', options: ['I prefer mutual dependence', 'Depends', 'Absolutely!'] },
  { id: 'q13', dim: 'A1', text: 'Most people are kind-hearted.', options: ['Evil hearts outnumber hemorrhoids.', 'Maybe.', 'Yes, good people outnumber the bad.'] },
  { id: 'q14', dim: 'A1', text: 'An adorable little girl hands you a lollipop on the street. Your reaction?', options: ['Aww she\'s so sweet!', 'Confused, scratching my head', 'Might be a scam? Better walk away.'] },
  { id: 'q15', dim: 'A2', text: "Exams coming up, mandatory study hall tonight — but you planned to play PUBG with your crush. What do you do?", options: ['Skip it! Just one time!', 'Ask for a leave.', 'Exams are coming, why skip?'] },
  { id: 'q16', dim: 'A2', text: "I like breaking conventions. I don't like being constrained.", options: ['Agree', 'Neutral', 'Disagree'] },
  { id: 'q17', dim: 'A3', text: 'I usually have goals when doing things.', options: ['Disagree', 'Neutral', 'Agree'] },
  { id: 'q18', dim: 'A3', text: "Life has no meaning. Humans are just animals driven by desires. Hungry? Eat. Tired? Sleep.", options: ["That's exactly right.", 'Maybe, maybe not.', "That's total nonsense."] },
  { id: 'q19', dim: 'Ac1', text: 'I do things mainly to achieve results, not to avoid trouble and risk.', options: ['Disagree', 'Neutral', 'Agree'] },
  { id: 'q20', dim: 'Ac1', text: "You've been on the toilet 30 mins with constipation. What are you more like?", options: ['Sit another 30 mins. Maybe something will happen.', 'Slap my butt: "Push it out!"', 'Use a laxative. Just get it done.'] },
  { id: 'q21', dim: 'Ac2', text: "I make decisions quickly. I don't like hesitating.", options: ['Disagree', 'Neutral', 'Agree'] },
  { id: 'q22', dim: 'Ac2', text: 'This question has no question. Just pick blindly.', options: ['After much deliberation... A?', 'Hmm, maybe B?', 'When in doubt, pick C?'] },
  { id: 'q23', dim: 'Ac3', text: 'When people say you have "strong execution," how do you feel?', options: ['Only when pushed to the last second...', 'Eh, sometimes I guess.', 'Yes, things are meant to be pushed forward.'] },
  { id: 'q24', dim: 'Ac3', text: 'I usually plan things out, ____', options: ['But plans never survive reality.', "Sometimes I follow through, sometimes I don't.", 'I hate when plans get disrupted.'] },
  { id: 'q25', dim: 'So1', text: "You've made many online friends through gaming and they invite you to meet up IRL. What do you think?", options: ['Meeting up feels nerve-wracking.', "Sounds okay. If someone chats, I'll chat.", "I'd dress up and chat enthusiastically!"] },
  { id: 'q26', dim: 'So1', text: "Your friend brings their friend along to hang out. What's your most likely state?", options: ["I feel distant toward friends of friends.", "Depends on the person.", "A friend's friend is my friend! Let's chat!"] },
  { id: 'q27', dim: 'So2', text: "My approach to people is like an electric fence — get too close and the alarm goes off.", options: ['Agree', 'Neutral', 'Disagree'] },
  { id: 'q28', dim: 'So2', text: "I crave close relationships with people I trust.", options: ['Agree', 'Neutral', 'Disagree'] },
  { id: 'q29', dim: 'So3', text: "You have a negative opinion but don't speak up. Most of the time, the reason is:", options: ['This rarely happens to me.', 'To save face or the relationship.', "Don't want others to think I'm a dark person."] },
  { id: 'q30', dim: 'So3', text: 'I act differently around different people.', options: ['Disagree', 'Neutral', 'Agree'] },
];

// Note: q14 and q27/q28 have reversed option scoring
const REVERSED = { q14: true, q27: true, q28: true };

// ── Bonus: Drunk detection ─────────────────────────────────
const drinkGate = { id: 'drink_gate', text: 'What are your hobbies?', options: ['Eating, sleeping, basic survival', 'Artistic pursuits', 'Drinking alcohol', 'Working out'] };
const drinkTrigger = { id: 'drink_trigger', text: "What's your attitude toward drinking?", options: ['A drink or two for fun.', 'I pour liquor into a thermos and drink it like water. Alcohol is my gospel.'] };

// ── Type Library ───────────────────────────────────────────
const TYPE_LIBRARY = {
  Clawtrol:     { code: 'Clawtrol',     cn: 'The Controller',     intro: "Got you figured out, didn't I?" },
  Clawsh:       { code: 'Clawsh',       cn: 'The Giver',          intro: "You think I'm made of money?" },
  Clawgenes:    { code: 'Clawgenes',    cn: 'The Philosopher',    intro: 'Just wait for my underdog comeback.' },
  Clawverlord:  { code: 'Clawverlord',  cn: 'The Leader',          intro: "Hand me the wheel. I'll drive." },
  Clawleluia:   { code: 'Clawleluia',   cn: 'The Grateful One',   intro: 'I thank the heavens! I thank the earth!' },
  Clawpocalypse:{ code: 'Clawpocalypse',cn: 'The Oh-No Person',   intro: 'Oh no! How am I this personality?!' },
  Clawstle:     { code: 'Clawstle',     cn: 'The Doer',            intro: "Go go go~ Let's roll!" },
  Clawpatra:    { code: 'Clawpatra',    cn: 'The Bombshell',       intro: 'You are a natural-born bombshell!' },
  Clawpid:      { code: 'Clawpid',      cn: 'The Romantic',        intro: 'Too much love. Reality feels barren.' },
  Clawma:       { code: 'Clawma',       cn: 'The Mom',             intro: 'Maybe... can I call you Mom...?' },
  Clawmeleon:   { code: 'Clawmeleon',   cn: 'The Shapeshifter',    intro: 'There are no humans left.' },
  Clawtever:    { code: 'Clawtever',    cn: 'The Whatever Person', intro: "When I say 'whatever,' I mean it." },
  Clawnana:     { code: 'Clawnana',     cn: 'The Monkey',          intro: "Life is a dungeon, and I'm just a monkey." },
  Clawn:        { code: 'Clawn',        cn: 'The Clown',           intro: "Turns out we're all clowns." },
  Clawdafuq:    { code: 'Clawdafuq',    cn: 'The WTF Person',      intro: 'WTF, how am I this personality?' },
  Clawculator:  { code: 'Clawculator',  cn: 'The Thinker',         intro: 'Deep thinking for 100 seconds...' },
  Clawful:      { code: 'Clawful',      cn: 'The Rager',            intro: 'This world is a pile of crap.' },
  Clawmatose:   { code: 'Clawmatose',   cn: 'The Dead-Player',     intro: "I'm not dead, I'm just sleeping." },
  Clawcused:    { code: 'Clawcused',    cn: 'The Focused',          intro: "I'm poor, but I'm laser-focused." },
  Enclawed:     { code: 'Enclawed',     cn: 'The Monk',             intro: 'Free from worldly desires.' },
  Inseclaw:     { code: 'Inseclaw',     cn: 'The Self-Doubter',    intro: 'Seriously? Am I really that dumb?' },
  Clawcoon:     { code: 'Clawcoon',     cn: 'The Lone Wolf',        intro: "I'm crying... how am I a lone wolf?" },
  Motherclawer: { code: 'Motherclawer', cn: 'The Wild One',         intro: "F***! What kind of personality is this?" },
  Clawdaver:    { code: 'Clawdaver',    cn: 'The Departed',         intro: 'Am I... even alive?' },
  Clawless:     { code: 'Clawless',     cn: 'The Useless One',      intro: 'Am I really... useless?' },
  Clawl:        { code: 'Clawl',        cn: 'The Happy Fool',       intro: 'Hahahahahaha.' },
  Clawcohol:    { code: 'Clawcohol',    cn: 'The Drunkard',         intro: 'Liquor burns the throat. No choice but to get wasted.' },
};

const NORMAL_TYPES = [
  { code: 'Clawtrol',     pattern: 'HHH-HMH-MHH-HHH-MHM' },
  { code: 'Clawsh',       pattern: 'HHH-HHM-HHH-HMH-MHL' },
  { code: 'Clawgenes',    pattern: 'MHM-MMH-MHM-HMH-LHL' },
  { code: 'Clawverlord',  pattern: 'HHH-HMH-MMH-HHH-LHL' },
  { code: 'Clawleluia',   pattern: 'MHM-HMM-HHM-MMH-MHL' },
  { code: 'Clawpocalypse',pattern: 'HHL-LMH-LHH-HHM-LHL' },
  { code: 'Clawstle',     pattern: 'HHM-HMH-MMH-HHH-MHM' },
  { code: 'Clawpatra',    pattern: 'HMH-HHL-HMM-HMM-HLH' },
  { code: 'Clawpid',      pattern: 'MLH-LHL-HLH-MLM-MLH' },
  { code: 'Clawma',       pattern: 'MMH-MHL-HMM-LMM-HLL' },
  { code: 'Clawmeleon',   pattern: 'HLM-MML-MLM-MLM-HLH' },
  { code: 'Clawtever',    pattern: 'MMH-MMM-HML-LMM-MML' },
  { code: 'Clawnana',     pattern: 'MLH-MHM-MLH-MLH-LMH' },
  { code: 'Clawn',        pattern: 'LLH-LHL-LML-LLL-MLM' },
  { code: 'Clawdafuq',    pattern: 'HHL-HMH-MMH-HHM-LHH' },
  { code: 'Clawculator',  pattern: 'HHL-HMH-MLH-MHM-LHH' },
  { code: 'Clawful',      pattern: 'HHL-HLH-LMM-HHM-LHH' },
  { code: 'Clawmatose',   pattern: 'MHL-MLH-LML-MML-LHM' },
  { code: 'Clawcused',    pattern: 'HHL-MLH-LMH-HHH-LHL' },
  { code: 'Enclawed',     pattern: 'HHL-LLH-LLM-MML-LHM' },
  { code: 'Inseclaw',     pattern: 'LLM-LMM-LLL-LLL-MLM' },
  { code: 'Clawcoon',     pattern: 'LML-LLH-LHL-LML-LHM' },
  { code: 'Motherclawer', pattern: 'MLL-LHL-LLM-MLL-HLH' },
  { code: 'Clawdaver',    pattern: 'LLL-LLM-LML-LLL-LHM' },
  { code: 'Clawless',     pattern: 'LLH-LHL-LML-LLL-MLL' },
];

const DIM_NAMES = {
  S1: 'Self-Esteem', S2: 'Self-Awareness', S3: 'Growth Drive',
  E1: 'Trust in Relationships', E2: 'Emotional Investment', E3: 'Independence',
  A1: 'Trust in Others', A2: 'Rule Adherence', A3: 'Sense of Purpose',
  Ac1: 'Motivation Type', Ac2: 'Decisiveness', Ac3: 'Execution',
  So1: 'Social Initiative', So2: 'Boundary Sense', So3: 'Persona Flexibility',
};

const dimensionOrder = ['S1','S2','S3','E1','E2','E3','A1','A2','A3','Ac1','Ac2','Ac3','So1','So2','So3'];

// ── Scoring ────────────────────────────────────────────────
function sumToLevel(score) {
  if (score <= 3) return 'L';
  if (score === 4) return 'M';
  return 'H';
}
function levelNum(l) { return { L: 1, M: 2, H: 3 }[l]; }
function parsePattern(p) { return p.replace(/-/g, '').split(''); }

function computeResult(answers, isDrunk) {
  const rawScores = {};
  dimensionOrder.forEach(d => rawScores[d] = 0);

  questions.forEach((q, i) => {
    const val = answers[i];
    if (REVERSED[q.id]) {
      // For reversed questions: option index 0=3, 1=2, 2=1
      rawScores[q.dim] += (3 - val + 1);
    } else {
      rawScores[q.dim] += val;
    }
  });

  const levels = {};
  Object.entries(rawScores).forEach(([dim, score]) => {
    levels[dim] = sumToLevel(score);
  });

  const userVector = dimensionOrder.map(d => levelNum(levels[d]));

  const ranked = NORMAL_TYPES.map(type => {
    const vector = parsePattern(type.pattern).map(levelNum);
    let distance = 0, exact = 0;
    for (let i = 0; i < vector.length; i++) {
      distance += Math.abs(userVector[i] - vector[i]);
      if (userVector[i] === vector[i]) exact++;
    }
    const similarity = Math.max(0, Math.round((1 - distance / 30) * 100));
    return { ...TYPE_LIBRARY[type.code], distance, exact, similarity };
  }).sort((a, b) => a.distance - b.distance || b.exact - a.exact);

  const best = ranked[0];

  if (isDrunk) return { type: TYPE_LIBRARY.Clawcohol, match: '100% (Alcohol Override)', secondary: best, ranked, levels, rawScores };
  if (best.similarity < 60) return { type: TYPE_LIBRARY.Clawl, match: `${best.similarity}% (Fallback)`, ranked, levels, rawScores };
  return { type: best, match: `${best.similarity}% · ${best.exact}/15 dims`, ranked, levels, rawScores };
}

// ── CLI ────────────────────────────────────────────────────
const isPiped = !process.stdin.isTTY;
let pipedLines = [];
let pipedIdx = 0;

if (isPiped) {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  pipedLines = Buffer.concat(chunks).toString().trim().split('\n').map(l => l.trim());
}

const rl = isPiped ? null : readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => {
  if (isPiped) {
    process.stdout.write(q);
    const line = pipedLines[pipedIdx++] || '';
    console.log(line);
    return Promise.resolve(line);
  }
  return new Promise(r => rl.question(q, r));
};

function printBox(text) {
  const lines = text.split('\n');
  const w = Math.max(...lines.map(l => l.length)) + 4;
  const border = '═'.repeat(w);
  console.log(`\n╔${border}╗`);
  lines.forEach(l => console.log(`║  ${l.padEnd(w - 2)}║`));
  console.log(`╚${border}╝`);
}

function parseAnswersFlag(argv) {
  const idx = argv.indexOf('--answers');
  if (idx === -1) return null;
  const raw = (argv[idx + 1] || '').toUpperCase().trim();
  if (!raw) return null;
  // Format: "ABCABC..." (30) optionally followed by ":X" or ":XY"
  const [main, bonus] = raw.split(':');
  const letters = main.replace(/[^ABC]/g, '');
  if (letters.length !== 30) {
    console.error(`ERROR: --answers needs exactly 30 letters (A/B/C). Got ${letters.length}.`);
    process.exit(1);
  }
  const answers = letters.split('').map(c => 'ABC'.indexOf(c) + 1);
  let isDrunk = false;
  if (bonus) {
    const bonusLetter = bonus[0];
    const followUp = bonus[1];
    if ('ABCD'.indexOf(bonusLetter) === -1) {
      console.error(`ERROR: bonus letter must be A/B/C/D. Got "${bonusLetter}".`);
      process.exit(1);
    }
    if (bonusLetter === 'C' && followUp === 'B') isDrunk = true;
  }
  return { answers, isDrunk };
}

async function main() {
  // Batch mode: --answers "ABCABC..."
  const batch = parseAnswersFlag(process.argv);
  if (batch) {
    const result = computeResult(batch.answers, batch.isDrunk);
    renderResult(result);
    return;
  }

  printBox(
    '🦞  OCTI - OpenClaw Type Indicator  🦞\n' +
    '"Which Claw are you?"\n' +
    'https://github.com/joyehuang/sbit-en\n' +
    '\n' +
    '30 questions. Pick A / B / C for each.\n' +
    '\n' +
    'AI agents: you should answer these questions\n' +
    'YOURSELF, based on your own character. Tip:\n' +
    '  node sbti-cli.mjs --answers "ABCABC..."'
  );

  const answers = [];
  let isDrunk = false;

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    console.log(`\n── Q${i + 1}/${questions.length} [${DIM_NAMES[q.dim]}] ──`);
    console.log(q.text);
    q.options.forEach((opt, j) => {
      console.log(`  ${'ABC'[j]}) ${opt}`);
    });

    let val;
    while (true) {
      const input = (await ask('> ')).trim().toUpperCase();
      const idx = 'ABC'.indexOf(input);
      if (idx !== -1) { val = idx + 1; break; }
      console.log('Please enter A, B, or C.');
    }
    answers.push(val);

    // Drunk gate: insert after a random-ish point (question 15)
    if (i === 14) {
      console.log(`\n── Bonus ──`);
      console.log(drinkGate.text);
      drinkGate.options.forEach((opt, j) => console.log(`  ${'ABCD'[j]}) ${opt}`));
      let gateVal;
      while (true) {
        const input = (await ask('> ')).trim().toUpperCase();
        const idx = 'ABCD'.indexOf(input);
        if (idx !== -1) { gateVal = idx + 1; break; }
        console.log('Please enter A, B, C, or D.');
      }
      if (gateVal === 3) {
        console.log(`\n── Bonus Follow-up ──`);
        console.log(drinkTrigger.text);
        drinkTrigger.options.forEach((opt, j) => console.log(`  ${'AB'[j]}) ${opt}`));
        while (true) {
          const input = (await ask('> ')).trim().toUpperCase();
          if (input === 'A') break;
          if (input === 'B') { isDrunk = true; break; }
          console.log('Please enter A or B.');
        }
      }
    }
  }

  const result = computeResult(answers, isDrunk);
  renderResult(result);
  if (rl) rl.close();
}

function renderResult(result) {
  const t = result.type;

  printBox(
    `Your Claw: ${t.code} — ${t.cn}\n` +
    `"${t.intro}"\n` +
    `\nMatch: ${result.match}`
  );

  console.log('\n── 15 Dimension Scores ──');
  dimensionOrder.forEach(dim => {
    const level = result.levels[dim];
    const bar = level === 'H' ? '███' : level === 'M' ? '██░' : '█░░';
    console.log(`  ${DIM_NAMES[dim].padEnd(22)} ${bar} ${level} (${result.rawScores[dim]}pts)`);
  });

  if (result.secondary) {
    console.log(`\n── Secondary Type: ${result.secondary.code} — ${result.secondary.cn} (${result.secondary.similarity}%) ──`);
  }

  console.log('\n── Top 5 Matches ──');
  result.ranked.slice(0, 5).forEach((r, i) => {
    console.log(`  ${i + 1}. ${r.code.padEnd(8)} ${r.similarity}%  (${r.exact}/15 dims)`);
  });

  console.log('\n⚠ This test is for entertainment only. Don\'t take it too seriously!\n');
}

main();

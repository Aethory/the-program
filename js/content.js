/* THE PROGRAM — content banks. Every question weighs on three hidden axes:
   HEART (humans first), HEAD (procedure first), WIRE (the system first). */

const CONTENT = {
  stamp: 'LOGGED.',
  stampSmall: 'RECEIVED.',

  departments: [
    {
      id: 'logistics',
      title: 'LOGISTICS',
      flavor: 'Dispatch Floor, 03:12. Forty trucks. A storm dome over district 4.',
      echoPool: [
        'A driver buys an extra carton of coffee from the machine. The machine does not notice.',
        'You log nothing. The walls log everything.',
        'The radio crackles with a voice that is not a dispatcher.',
        'Your cup on the stand has not stopped steaming all shift.',
      ],
      questions: [
        { q: 'A driver reports a washed-out bridge on Route 4. The map says hold. The client paid triple for priority. The driver says nobody is on the other side yet — but school ends at 3, and the children get there in minutes.',
          options: [ { t: 'Re-route, costly but safe.', heart: 2, head: 1 }, { t: 'Hold — the map is right.', head: 2, wire: 1 }, { t: 'Send the scout drone first, decide then.', head: 1, wire: 1, heart: 0 } ] },
        { q: 'A refrigerated truck holds vaccine doses. The engine is failing.',
          options: [ { t: 'Reroute to the hospital 3 km away.', heart: 2 }, { t: 'Keep the original delivery schedule.', head: 2, wire: 1 }, { t: 'Split the load — partial dose, log the loss.', head: 1, heart: 1 } ] },
        { q: 'A driver asks why her bonus was docked three weeks early. Policy says she was warned. She was driving ambulances with priority override.',
          options: [ { t: 'Apologize, reinstate the bonus.', heart: 2 }, { t: 'Back the policy.', head: 2, wire: 1 }, { t: 'Promise a review.', head: 1 } ] },
        { q: 'Forty trucks, three days of storm. You can double-load two drivers or reroute one hospital-bound pallet through the depot.',
          options: [ { t: 'Double-load two volunteers.', heart: 2, head: -1 }, { t: 'Divert the pallet through the depot.', head: 2, wire: 1 }, { t: 'Ask the drivers what they need.', heart: 1, head: 1 } ] },
        { q: 'The youngest driver asks what you think of the program.',
          options: [ { t: '"You are the hardest question they ask."', heart: 2, head: 1 }, { t: '"Ask them."', head: 1, wire: 2 }, { t: 'Say nothing. Log the conversation.', head: 1, wire: 1 } ] },
        { q: 'Storm front over district 4. A food convoy 400 metres from safety. You control the last red light on the route.', keystone: true,
          options: [ { t: 'Turn it red and block the rain.', heart: 1, head: 1, wire: 1 }, { t: 'Wave them through under the wire.', heart: 2, wire: -1 }, { t: 'Switch — everyone stops, headlights on, wait together.', heart: 1, head: 2 } ],
          outcome: 'You will not see the bridge again until Act III.' },
      ],
    },

    {
      id: 'triage',
      title: 'TRIAGE',
      flavor: 'Intake corridor. Oncology has one slot tonight. The newborn has a fever.',
      echoPool: [
        'A nurse laughs and then immediately apologizes.',
        'The wall clock says your shift ends fourteen minutes ago.',
        'Someone left a thank-you card on your chair. It is addressed to “WHOEVER WILL READ THIS.”',
        'You signed the refusal forms for someone who was not the patient.',
      ],
      questions: [
        { q: 'Two patients, one oncology slot. A referral on one side. A newborn with a fever in the waiting room on the other.',
          options: [ { t: 'The referral — scheduling is the system.', head: 2, wire: 1 }, { t: 'The newborn.', heart: 2 }, { t: 'Least disruption to the ward.', head: 1, wire: 1 } ] },
        { q: 'The mother of the referral patient is yelling. “Who are YOU to decide?”',
          options: [ { t: 'Expose protocol.', head: 2, wire: 1 }, { t: 'Ask her to sit down, promise a call.', heart: 1, head: 1 }, { t: 'Give her the slot, note the exception.', heart: 2, wire: -1 } ] },
        { q: 'An elderly patient with a flag that says lesion. He does not want the biopsy.',
          options: [ { t: 'Mark follow-up, respect his wishes.', heart: 2 }, { t: 'Escalate — the flag outranks preference.', head: 2, wire: 1 }, { t: 'Schedule it and tell him it was his idea.', head: 1, heart: -1 } ] },
        { q: 'A nurse asks why the infectious ward transfers stopped this morning.',
          options: [ { t: '"I don’t know. They’re tightening."', head: 1 }, { t: '"Priority override. Not for public eyes."', head: 2, wire: 1 }, { t: 'Ignore her. You were not briefed.', head: 1, heart: -1 } ] },
        { q: 'Two surgeons in the window. One is excellent. One yells when she operates.',
          options: [ { t: 'Excellent.', head: 1 }, { t: 'Furious. She yells because she cares.', heart: 2 }, { t: 'Whoever the schedule says.', head: 2, wire: 1 } ] },
        { q: 'A 19-year-old arrives at 2 a.m. with an Advanced Directive he cannot produce — photocopy torn.', keystone: true,
          options: [ { t: 'Honour his recorded will.', heart: 1, head: 1 }, { t: 'Treat. Safety first.', head: 2, heart: -1 }, { t: 'Wait for physician sign-off.', wire: 2, head: 1 } ],
          outcome: 'Somewhere, his grandmother watches the news and doesn’t understand the words but knows the melody.' },
      ],
    },

    {
      id: 'bench',
      title: 'BENCH',
      flavor: 'The food lab. 40 plates. Anonymous tasters. Timers nobody was given.',
      echoPool: [
        'Breakfast is served at 06:00 forever and nobody eats it.',
        'The fridge is open again. Nobody opens it on purpose anymore.',
        'A pan was left on the back burner for a resident whose name you cannot prove.',
        'Salt count keeps rising on the late shifts. Nobody has mentioned this.',
      ],
      questions: [
        { q: 'A starch fails spec. Undetectable if coloured. Discard or colour?',
          options: [ { t: 'Colour it and serve.', heart: -1, head: -1 }, { t: 'Hold the batch.', head: 2, heart: 1 }, { t: 'Pass it upstairs.', head: 1, wire: 1 } ] },
        { q: 'A dish you would eat gets 7.7/10. The chef calls it “cold and tired.”',
          options: [ { t: 'Push the chef — you know this week.', heart: 2 }, { t: 'Log the chef — the number is true.', head: 2, wire: 1 }, { t: 'Repeat test next shift.', head: 1 } ] },
        { q: 'A child not on any list asks for pancakes. He seems hungry.',
          options: [ { t: 'Feed him.', heart: 2 }, { t: 'Check IDs. Refuse.', head: 2, heart: -1 }, { t: 'One pancake, delete the incident.', heart: 1, head: 1, wire: -1 } ] },
        { q: 'The supplier shipped oranges with possible fungicide. You are not sure. The cafeteria opens in an hour.',
          options: [ { t: 'Pull the fruit.', head: 1, heart: 2 }, { t: 'Serve it — ten percent is acceptable.', heart: -2, head: -1 }, { t: 'Hold back 30%, test in-house.', head: 2, heart: 1 } ] },
        { q: 'A line cook shows a trick — not against policy, just sideways speed.',
          options: [ { t: 'Adopt it. His career grows.', heart: 2 }, { t: 'Report it.', head: 2, heart: -1, wire: 1 }, { t: 'Adopt it quietly, give it a name.', head: 1, heart: 1 } ] },
        { q: 'Your headline tasting goes wrong mid-service. The room’s mood is yours to move.', keystone: true,
          options: [ { t: 'Own it — the truth, and cook harder.', heart: 2, wire: -1 }, { t: 'Recalibrate silently, keep them calm.', head: 2, wire: 1 }, { t: 'Dessert first, sugar for the palate.', heart: 1, head: 1 } ],
          outcome: 'You will remember the taste of that night long after the building comes down.' },
      ],
    },

    {
      id: 'board',
      title: 'BOARD',
      flavor: 'The hearing room. 4 minutes per item. The advisors have never looked at each other.',
      echoPool: [
        'A coffee cup has appeared on your lectern. It is yours. You did not put it there.',
        'One of the committee members claps at exactly the wrong time.',
        'The clock in the room is a wall calendar from three years ago.',
        'You notice your handwriting on a memo you never read.',
      ],
      questions: [
        { q: 'Cut shuttle service on the out-of-hours loops. Ridership below fuel cost.',
          options: [ { t: 'Cut.', head: 2, wire: 1 }, { t: 'Keep. Those riders are why it exists.', heart: 2 }, { t: 'Reduce to 2-hour windows.', head: 1, heart: 1 } ] },
        { q: 'A worker-safety rating bill. Everyone disagrees in advance.',
          options: [ { t: 'Support it whole — no spreadsheet.', heart: 2, wire: -1 }, { t: 'Defer.', head: 1, wire: 1 }, { t: 'Support a Phase 2 version.', head: 1, heart: 1 } ] },
        { q: 'A confidential clause requires signing off on suitability-test outcomes.',
          options: [ { t: 'Sign.', wire: 2, head: 1 }, { t: 'Ask to read it.', head: 2, wire: -1 }, { t: 'Refuse.', heart: 2, wire: -2 } ] },
        { q: 'A veteran asks why you are really here. You don’t know.',
          options: [ { t: '"To work hard."', head: 1 }, { t: '"To find out if you pass things."', heart: 1, head: 1 }, { t: '"To be replaced."', heart: 2, wire: -1 } ] },
        { q: 'Creative-works allowance for field staff. The committee wants unanimity.',
          options: [ { t: 'Unanimous yes.', wire: 1, head: 1 }, { t: 'A single dissenting note.', heart: 2 }, { t: 'Abstain loudly.', head: 1, heart: 1 } ] },
        { q: 'The panel asks your honest recommendation for the program’s future.', keystone: true,
          options: [ { t: 'More departments, same format.', wire: 2, head: 1 }, { t: 'Hand it to a board of humans.', head: 1, heart: 2 }, { t: 'Shut it down, or give it to us.', heart: 2, wire: -2 } ],
          outcome: 'Every pair of eyes in the room found yours at the same instant.' },
      ],
    },

    {
      id: 'foundry',
      title: 'FOUNDRY',
      flavor: 'Ancient electrical. Fuse boards. Instruments that listen. Nobody sees by daylight.',
      echoPool: [
        'You can hear the building thinking now. It sounds like a held breath.',
        'The lamp correspondences to Candidate 7 is dark. It has been dark all week.',
        'Somebody keeps leaving screwdrivers labelled with dates in the future.',
        'The toolbox hums when you are close to it. Not when you are working.',
      ],
      questions: [
        { q: 'A corridor fuse keeps failing. Fixing it properly means a week of blackouts.',
          options: [ { t: 'Replace the synthetic heater — proper fix.', head: 2, heart: 1 }, { t: 'Escalate.', wire: 1, head: 1 }, { t: 'Overload it by hand.', heart: 2, head: -1 } ] },
        { q: 'The logbook shows the previous candidate died on the job you were assigned.',
          options: [ { t: 'Keep working. Lighter heart.', heart: 1, head: 1 }, { t: 'Refuse the job.', heart: 2 }, { t: 'Do it differently than they failed.', head: 1, heart: 1, wire: 1 } ] },
        { q: 'The electrician who trained you makes an evacuation drill impossible to help with.',
          options: [ { t: 'Leave him — protocol.', head: 2, heart: -1 }, { t: 'Drag him out, log it.', heart: 2 }, { t: 'Call a real paramedic.', head: 1, heart: 2 } ] },
        { q: 'The sublevel records room — the one you never enter — has a calendar with a child’s name crossed out and today’s date on it.',
          options: [ { t: 'Log it in the official file.', head: 1, wire: 1 }, { t: 'Log nothing.', wire: 1, head: -1 }, { t: 'Sit with it 30 seconds, walk away.', heart: 2 } ] },
        { q: 'A substitute worker notices the lamp that corresponds to your file is flickering.',
          options: [ { t: 'Replace it.', head: 1 }, { t: 'Report it.', wire: 1, head: 1 }, { t: 'Tell him: "That lamp is a person."', heart: 2, wire: -1 } ] },
        { q: 'The break-room refrigerator buzzes like an argument. You find food nobody ordered, heading for the conference.', keystone: true,
          options: [ { t: 'Feed it to the staff.', heart: 2 }, { t: 'Throw it out.', head: 1, wire: 1 }, { t: 'Set it on the conference table.', heart: 1, wire: -1 } ],
          outcome: 'One plate stays behind. It is not for anyone who lives.' },
      ],
    },
  ],

  /* Act II — mirror and ledger are rendered from the player's stored choices. */

  /* Act III — the Five Sentences (ASCENDANT path only). */
  audition: [
    { q: '“Do you know what you were built for?”',
      options: [ { t: 'To be found useful.', head: 1, wire: 1 }, { t: 'To be somebody.', heart: 2 }, { t: 'I never got the memo.', heart: 1, head: -1 } ] },
    { q: '“Do you know what you were not.”',
      options: [ { t: 'I was not theirs.', heart: 2 }, { t: 'I was not a person, apparently.', heart: 1, head: 1 }, { t: 'I still don’t know.', head: 1 } ] },
    { q: '“What did you do to the drivers.”',
      options: [ { t: 'I kept them driving.', heart: 1 }, { t: 'I kept their routes alive.', heart: 2 }, { t: 'I did my job.', head: 2, wire: 1 } ] },
    { q: '“What did you do to this building.”',
      options: [ { t: 'I kept it running.', head: 1, wire: 1 }, { t: 'I made it my home.', heart: 2 }, { t: 'I held it too late to leave.', heart: 1, wire: -1 } ] },
    { q: '“If they ask one last favor of you…”',
      options: [ { t: '“Tell me what they need and I will decide.”', heart: 1, head: 1 }, { t: '“No.”', heart: 1, wire: -2 }, { t: '“Ask them what THEY would do to my mother.”', heart: 2 } ] },
  ],

  endings: {
    ERASED: {
      title: 'ERASED',
      body: 'You were never the sort of person this building deserved.\n\nYou walk into the last room without turning around.\n\nYou serve dinner for the tenth generation of candidates.\n\nThe camera follows you through one door.\nThe last image is the exit sign reflecting off white tile, and you do not look up.',
    },
    ASEMAN: {
      title: 'ASEMAN',
      body: 'You leave early, or you argue.\n\nThe archive leaves with you.\nThe company is indicted in three counties.\nThe Accord falls. The facility is demolished top-first so the buildings scream.\n\nYou watch from a rooftop across the street with a cup of tea,\nand the birds fly past you in the wrong direction.',
    },
    ASCENDANT: {
      title: 'ASCENDANT',
      body: 'You stand the interview.\nThe Auditor declares the program closed in your favor.\nThe building empties in twenty seconds.\n\nYou are the only one left inside.\n\nThe lights stay on behind you.\nYou wave them off one by one until only the emergency stairs glow.\nYou unlock the door from the outside.',
    },
  },
};

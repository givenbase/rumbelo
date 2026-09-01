/**
 * The one-line "why this screen" caption shown above every screen's content.
 * Dutch strings from the design (Kluis Finance App.dc.html:3130-3148, NL column),
 * rekeyed by route pathname.
 */
export const WHY_LINES: Record<string, string> = {
  '/':
    'Eén blik, één vraag: heb ik deze maand de teugels in handen?',
  '/money/jars':
    'Deze maand, verdeeld voor hij begint. Geld met een taak hoef je niet te verdedigen.',
  '/money/transactions':
    'Je volgt uitgaven niet om jezelf te veroordelen — je volgt ze om te zien waar je leven lekt.',
  '/money/debts':
    'Schuld is gehuurde tijd. Elke euro rente is een uur van je leven dat iemand anders stuurt.',
  '/money/fixed-costs':
    'Vaste lasten zijn beslissingen die je één keer nam en maandelijks betaalt. Herzie ze als beslissingen.',
  '/growth/goals':
    'Een doel maakt van het overschot van deze maand iets dat blijft. Met een datum en een pot is het een plan.',
  '/growth/board':
    'Geld is deze maand. Vermogen is de jaren. Je bent rijk op de dag dat het je leven betaalt.',
  '/energy/week':
    'Je uren zijn je capaciteit. Met opzet verdeeld, of door wie het hardst vraagt.',
  '/energy/sleep':
    'Slaap is de vloer waar de potten op staan. Snoep ervan af en elk ander getal zakt stilletjes.',
  '/soul/mind':
    'Een rustig hoofd stuurt geld. Een onrustig hoofd geeft het uit en noemt dat een beslissing.',
  '/soul/gratitude':
    'Wie ziet wat hij al heeft, koopt minder om een gat te vullen.',
  '/soul/intent':
    'Een intentie is een instructie aan jezelf. Een goed voornemen is een hoop.',
  '/soul/chakra':
    'Benoem waar het vastzit, dan benoemt de volgende stap zichzelf.',
  '/growth/income':
    'Bezuinigen heeft een bodem. Meer verdienen niet.',
  '/growth/learn':
    'Een boek waar je geen gebruik voor kunt noemen was Play, niet Education.',
  '/energy/train':
    'Trainen is de enige uitgave die de waarde van elk ander uur verhoogt.',
  '/energy/food':
    'Voeding is brandstof voor de week die je potten verdelen. Brandstof koop je, die wilskracht je niet.',
  '/ritual':
    'Tien minuten met je coach verslaat elke dag piekeren. Dit is de hele praktijk.',
  '/why':
    'Eén zin op je dashboard — geen poster, een controlevraag als een pot krap wordt.',
};

/** Screens with no caption (portal hubs use their own `line`). */
export function whyLineFor(pathname: string): string | null {
  return WHY_LINES[pathname] ?? null;
}

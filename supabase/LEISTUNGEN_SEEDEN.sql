-- ============================================================
-- LONI GALABAU GMBH – ALLE 8 LEISTUNGSSEITEN
-- Im Supabase SQL Editor ausführen:
-- app.supabase.com/project/xumyctlxnxsdqxvlbyui/sql/new
-- ============================================================

INSERT INTO public.services (slug, title, category, short_text, long_text, sort_order, active) VALUES

-- 1. Natursteinarbeiten
(
  'natursteinarbeiten',
  'Natursteinarbeiten',
  'Steinarbeiten',
  'Zeitlose Eleganz aus der Natur – Wir verlegen hochwertige Natursteine für Terrassen, Wege und Einfahrten. Jedes Projekt ist ein Unikat, handwerklich perfekt ausgeführt.',
  'Naturstein ist eines der ältesten und beständigsten Baumaterialien der Welt. Bei Loni Galabau GmbH arbeiten wir mit einer sorgfältig kuratierten Auswahl edler Natursteine – von regionalem Sandstein über belgisches Granulat bis hin zu portugiesischem Kalkstein.

Unsere Natursteinarbeiten umfassen:
• Terrassen & Sitzflächen aus Naturstein (Belag, Verfugung, Drainagesystem)
• Natursteinmauern als Stütz- und Gartenelemente
• Wege und Zufahrten in Natursteinpflaster
• Stufenanlagen und Treppenbauten
• Trockenmauern aus regionalen Bruchsteinen
• Wassertische und Gartenbrunnen aus Naturstein

Jede Fläche wird fachgerecht auf einem stabilen Unterbau verlegt. Wir berücksichtigen Drainage, Frostsicherheit und Langlebigkeit – für ein Ergebnis, das Jahrzehnte überdauert.

Unsere Meister beraten Sie persönlich zur Steinauswahl, zur Farbgestaltung und zu regionalen Besonderheiten. Gerne erstellen wir Ihnen ein kostenloses Angebot vor Ort.',
  1,
  true
),

-- 2. Gartengestaltung
(
  'gartengestaltung',
  'Gartengestaltung',
  'Gartengestaltung',
  'Ihr Garten – individuell geplant und meisterhaft umgesetzt. Von der Erstberatung bis zur fertigen Grünoase: Wir gestalten Außenräume, die zu Ihrem Leben passen.',
  'Ein schöner Garten ist mehr als Pflanzenkunde – er ist Ausdruck Ihres Lebensgefühls. Wir entwickeln maßgeschneiderte Gartenkonzepte, die Ästhetik, Funktionalität und Nachhaltigkeit vereinen.

Unsere Gartengestaltung umfasst:
• Individuelle Gartenplanung mit 2D-/3D-Visualisierung (auf Wunsch)
• Neuanlage von Gärten – von der Planung bis zur Fertigstellung
• Umgestaltung bestehender Gärten
• Pflanzkonzepte für Staudenbeete, Hecken & Gehölze
• Gartenbeleuchtung & Outdoor-Technik
• Hochbeete, Kräutergärten & Gemüsegärten
• Sichtschutzlösungen mit natürlichen Materialien

Unser Planungsprozess beginnt immer mit einem persönlichen Gespräch. Wir klären Ihren Stil, Ihre Wünsche und das Budget – und entwickeln dann ein Konzept, das keine Wünsche offenlässt. Auf Wunsch koordinieren wir alle Gewerke und übergeben Ihnen einen fertigen Traumgarten.',
  2,
  true
),

-- 3. Pflasterarbeiten
(
  'pflasterarbeiten',
  'Pflasterarbeiten',
  'Steinarbeiten',
  'Einfahrten, Hofbefestigungen und Wege in höchster Qualität. Wir verlegen Beton- und Natursteinpflaster fachgerecht, dauerhaft und auf den Millimeter genau.',
  'Pflasterarbeiten sind das Fundament eines gelungenen Außenbereichs. Ob Einfahrt, Terrassenfläche, Gehweg oder Innenhof – Loni Galabau GmbH liefert Lösungen, die sowohl optisch als auch technisch überzeugen.

Unsere Pflasterarbeiten umfassen:
• Einfahrten & Stellplätze (Betonpflaster, Natursteinpflaster, versickerungsfähige Systeme)
• Hofbefestigungen für Gewerbe & Industrie
• Gehwege & Gartenwegesysteme
• Terrassen & Außensitzflächen
• Unterbau, Erdaushub & Tragschichtvorbereitung nach VOB
• Randeinfassung & Bordsteinsysteme
• Fugenarbeiten mit dauerhaften Fugenmaterialien

Wir arbeiten nach anerkannten Regeln der Technik (ATV DIN 18318) und verwenden ausschließlich Materialien geprüfter Qualität. Durch unsere eigene Maschinenflotte können wir auch große Flächen effizient bearbeiten.',
  3,
  true
),

-- 4. Bewässerungsanlagen
(
  'bewaesserungsanlagen',
  'Bewässerungsanlagen',
  'Technik',
  'Smarte Bewässerung spart Zeit, Wasser und schont die Umwelt. Wir planen und installieren automatische Bewässerungssysteme – für Privatgärten und gewerbliche Grünanlagen.',
  'Moderne Bewässerungsanlagen sind die unsichtbaren Helfer hinter jedem gepflegten Garten. Loni Galabau GmbH plant, liefert und installiert professionelle Bewässerungstechnik von führenden Herstellern wie Hunter, Rain Bird und Gardena.

Unsere Bewässerungsleistungen:
• Vollautomatische Bewässerungsanlagen mit Zeitsteuerung
• Versenkregner für Rasenflächen (Pop-up Sprinkler)
• Tropfbewässerung für Beete, Hecken & Gemüsegärten
• Regenwasser-Nutzung & Zisternensysteme
• Bodensensor- & Regensensorsteuerung
• Smart-Home-Integration (WLAN-Steuerung per App)
• Winterfestmachung & Wartungsservice

Eine professionell geplante Bewässerungsanlage spart bis zu 50 % Wasser im Vergleich zur manuellen Bewässerung. Wir berechnen Wasserbedarf, Leitungsquerschnitte und Druckverhältnisse individuell für Ihr Grundstück.',
  4,
  true
),

-- 5. Zaunarbeiten
(
  'zaunarbeiten',
  'Zaunarbeiten & Einfriedungen',
  'Gartengestaltung',
  'Sicherheit trifft Stil: Wir errichten Zäune, Tore und Einfriedungen in Metall, Holz und Stahl – individuell geplant, fachmännisch montiert und langlebig.',
  'Ein Zaun ist mehr als Grundstücksabgrenzung – er ist ein wesentliches Gestaltungselement und schützt Ihren privaten Lebensbereich. Loni Galabau GmbH realisiert Einfriedungslösungen in allen Materialien und Stilrichtungen.

Unsere Zaunleistungen umfassen:
• Metallzäune & Doppelstabmattenzäune (verzinkt, pulverbeschichtet)
• Holzzäune & Holzsichtschutz (Lärche, Douglasie, Kiefer)
• Stabgitterzäune für Sicherheit & Privatsphäre
• Rankgitter & Rankpergolen als dekorativer Sichtschutz
• Elektrisch betriebene Schiebetore & Drehtore
• Betonsockel & Pfosten nach statischen Anforderungen
• Reparatur und Sanierung bestehender Zaunanlage

Wir beraten Sie zu Zaunhöhen, Materialwahl und behördlichen Vorschriften (Bebauungsplan, Abstandsflächen). Alle Pfosten werden nach Herstellervorgaben in Betonfundamente eingesetzt.',
  5,
  true
),

-- 6. Rasenanlagen
(
  'rasenanlagen',
  'Rasenanlagen & Rollrasen',
  'Gartengestaltung',
  'Satter Grünrasen vom ersten Tag an – mit Rollrasen oder Ansaat. Wir bereiten den Boden professionell vor und liefern ein Ergebnis, das begeistert.',
  'Ein gleichmäßiger, satter Rasen ist das Herzstück jedes Gartens. Loni Galabau GmbH bietet professionelle Rasenlösungen – von der Bodenanalyse bis zur Erstpflege.

Unsere Rasenleistungen:
• Rollrasen-Verlegung: fertiger Traumrasen innerhalb eines Tages
• Rasenansaat mit geeigneten Saatmischungen (Spiel-, Zier-, Schatten-, Trockenrasen)
• Bodenvorbereitung: Abtragen, Planieren, Lockern, Humusaufbau
• Bodenanalyse & Düngeempfehlung
• Drainage & Entwässerung unter der Rasenfläche
• Mähroboter-Installation & Kabelverlegung (Husqvarna Automower, Honda, Gardena)
• Rasenreparatur & Nachsaat bei Kahlstellen

Für eine langfristig schöne Rasenfläche empfehlen wir unsere optionalen Pflegepakete. Sprechen Sie uns auf unsere Mähroboter-Installation an – moderne Geräte pflegen Ihren Rasen selbstständig, auch auf schwierigem Terrain.',
  6,
  true
),

-- 7. Erdarbeiten
(
  'erdarbeiten',
  'Erdarbeiten & Tiefbau',
  'Tiefbau',
  'Professionelle Erd- und Tiefbauarbeiten als Grundlage für jedes Bauprojekt. Mit eigenem Maschinenpark führen wir Aushub, Planierung und Entwässerung effizient durch.',
  'Bevor der erste Stein verlegt wird, braucht es ein stabiles Fundament. Loni Galabau GmbH führt alle Erd- und Tiefbauarbeiten mit eigenem Maschinenpark zuverlässig und termingerecht durch.

Unsere Tiefbau-Leistungen:
• Erdaushub für Keller, Fundamente & Tiefgaragen
• Planierarbeiten für Gartenflächen & Bauplätze
• Bodenverbesserung & Bodenaustausch (z. B. Ton gegen Kies)
• Böschungsarbeiten & Hangsicherung
• Kanalarbeiten (Schmutzwasser, Regenwasser, Drainage)
• Leerrohre & Kabelschutzrohre verlegen
• Rückbau von Bestandsflächen & Entsorgung

Durch unseren eigenen Maschinenpark (Bagger, Radlader, Rüttler, Verdichter) arbeiten wir unabhängig von Subunternehmern. Das sichert Qualität, Terminzuverlässigkeit und Kostenkontrolle.',
  7,
  true
),

-- 8. Entwässerung
(
  'entwaesserung',
  'Entwässerung & Drainage',
  'Tiefbau',
  'Stehendes Wasser zerstört Garten und Bausubstanz. Wir planen und verlegen professionelle Entwässerungssysteme – für dauerhaft trockene Terrassen, Wege und Rasenflächen.',
  'Wasseransammlungen nach Regen sind ein häufiges Problem bei Terrassen, Wegen und Rasenflächen. Loni Galabau GmbH analysiert die Ursache und entwickelt nachhaltige Entwässerungslösungen.

Unsere Entwässerungsleistungen:
• Oberflächenentwässerung: Rinnen, Schlitze, Gräben
• Unterirdische Drainage (Rigolen, Sickerschächte, Drainagerohre)
• Anschluss an öffentliche Kanalisation oder Rückhaltebecken
• Regenwasserzisternen zur Nutzung & Retention
• Versickerungsanlagen gemäß DIN 1986-100
• Balkone & Tiefgaragen-Entwässerung
• Drainagematten unter Terrassen & Pflasterflächen

Wir arbeiten eng mit dem zuständigen Ingenieurbüro zusammen und erstellen bei Bedarf Entwässerungsnachweise. Alle Anlagen werden nach aktuellen Normen ausgeführt.',
  8,
  true
)

ON CONFLICT (slug) DO UPDATE SET
  title       = EXCLUDED.title,
  category    = EXCLUDED.category,
  short_text  = EXCLUDED.short_text,
  long_text   = EXCLUDED.long_text,
  sort_order  = EXCLUDED.sort_order,
  active      = EXCLUDED.active,
  updated_at  = now();

-- ✅ Fertig! Alle 8 Leistungsseiten sind jetzt in der Datenbank.
-- Sie erscheinen sofort auf der Website unter /leistungen

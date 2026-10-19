-- Keyword-Umsetzung vom 19.10.2026: ausschließlich öffentliche Leistungstexte.
-- Einmalige Inhaltsänderung mit Konfliktschutz; keine Schema-/RLS-Änderung.
BEGIN;
DO $keyword_content$
DECLARE changed integer;
BEGIN
  UPDATE public.services SET
    title = 'Gartengestaltung',
    short_text = 'Ihren Garten gestalten lassen: Wir begleiten die abgestimmte Planung und führen die vereinbarten Gartenarbeiten aus. Terrasse, Wege, Rasen und Pflanzen entstehen passend zu Ihrem Alltag.',
    meta_title = 'Garten gestalten lassen – Planung & Bau | Loni GalaBau',
    meta_description = 'Garten gestalten lassen: Neubau oder bestehenden Garten umgestalten. Planung, Erdarbeiten, Terrasse und Grün abstimmen – deutschlandweit mit Loni GalaBau.',
    custom_faqs = '[{"q":"Übernehmen Sie auch die Ausführung der Gartengestaltung?","a":"Ja. Wir stimmen Planung und konkrete Bauleistungen gemeinsam mit Ihnen ab und führen die vereinbarten Gartenarbeiten aus. Für weitergehende Planungsaufgaben beziehen wir bei Bedarf unseren Planungspartner ein. Im Angebot halten wir fest, welche Leistungen zu Ihrem Vorhaben gehören."},{"a":"Ja. Gerade bei wenig Platz lohnt es sich, Sitzplatz, Wege und Pflanzflächen gemeinsam zu betrachten. Wir besprechen, welche Nutzungen Ihnen wichtig sind und was auf Ihrem Grundstück sinnvoll untergebracht werden kann.","q":"Lässt sich auch ein kleiner Garten neu gestalten?"},{"a":"Wir beziehen den Bestand in die Planung ein. Ob Pflanzen bleiben oder umgesetzt werden können, hängt unter anderem von ihrem Zustand, Standort und den vorgesehenen Bauarbeiten ab.","q":"Können vorhandene Pflanzen bei der Umgestaltung bleiben?"},{"a":"Neben der Fläche sind vor allem Rückbau, Erdarbeiten, Materialien, Pflanzenauswahl und Zugänglichkeit entscheidend. Deshalb stimmen wir den Umfang konkret ab, statt einen pauschalen Quadratmeterpreis für sehr unterschiedliche Gärten zu nennen.","q":"Was beeinflusst die Kosten einer Gartengestaltung?"},{"q":"Können wir die Gartengestaltung in Etappen umsetzen?","a":"Ja, die Reihenfolge wird passend zum Grundstück und den vereinbarten Arbeiten geplant. Wasserwege, Leitungen und spätere Anschlüsse sollten früh geklärt werden, damit bereits fertige Bereiche möglichst erhalten bleiben können."}]'::jsonb
  WHERE slug = 'gartengestaltung' AND active = true
    AND updated_at = '2026-10-01 07:44:32.672534+00'::timestamptz;
  GET DIAGNOSTICS changed = ROW_COUNT;
  IF changed <> 1 THEN RAISE EXCEPTION 'Inhaltskonflikt bei gartengestaltung; gesamten Vorgang zurückrollen'; END IF;
  UPDATE public.services SET
    title = 'Zaunarbeiten',
    short_text = 'Zaun bauen lassen – mit abgestimmtem Material und Montage. Wir planen Verlauf, Höhe, Sichtschutz und Tore zusammen mit Untergrund, Rückbau und den Anschlüssen auf Ihrem Grundstück.',
    meta_title = 'Zaun bauen lassen – Montage & Sichtschutz | Loni GalaBau',
    meta_description = 'Zaun bauen lassen: Material, Montage, Tore und Sichtschutz für Ihr Grundstück abstimmen. Loni GalaBau aus Hattersheim – deutschlandweit persönlich anfragen.',
    custom_faqs = '[{"q":"Was gehört zu einem Angebot für einen Zaun mit Montage?","a":"Neben Zaunfeldern oder Elementen sollten Pfosten, Befestigung, Fundamente und die vereinbarten Montagearbeiten beschrieben sein. Tore, Rückbau, besondere Anschlüsse und Wiederherstellung angrenzender Flächen können zusätzliche Positionen sein. Wir grenzen den Umfang für Ihren Zaunverlauf gemeinsam ab."},{"a":"Ja, unterschiedliche Gartenbereiche können verschiedene Anforderungen haben. Wir besprechen, wo eine offene Begrenzung genügt und wo Sichtschutz gewünscht ist. Das gewählte System und die örtlichen Bedingungen müssen dazu passen.","q":"Können Zaun und Sichtschutz kombiniert werden?"},{"a":"Hilfreich sind ein geklärter Grenzverlauf, Informationen zu vorhandenen Leitungen und alle erforderlichen Abstimmungen. Teilen Sie uns auch mit, ob der Zaun an Mauern anschließt oder ein alter Zaun zurückgebaut werden soll.","q":"Was sollte vor der Zaunmontage geklärt sein?"},{"a":"Das lässt sich anhand von Gefälle und Zaunsystem planen. Verlauf, Übergänge und Pfostenpositionen müssen zur Situation passen. Fotos und Angaben zum Höhenunterschied helfen bei der ersten Einschätzung.","q":"Lässt sich ein Zaun auch an einem Hang montieren?"},{"q":"Welche Angaben helfen bei einer Anfrage für Zaunbau?","a":"Nennen Sie Ort, ungefähre Länge, gewünschte Höhe, Materialwünsche und geplante Tore. Fotos von Verlauf, Gelände, alten Pfosten und Mauern helfen bei der Vorbereitung. Bekannte Leitungen und bereits geklärte Vorgaben sollten ebenfalls mitgeteilt werden."}]'::jsonb
  WHERE slug = 'zaunarbeiten' AND active = true
    AND updated_at = '2026-10-01 07:44:32.672534+00'::timestamptz;
  GET DIAGNOSTICS changed = ROW_COUNT;
  IF changed <> 1 THEN RAISE EXCEPTION 'Inhaltskonflikt bei zaunarbeiten; gesamten Vorgang zurückrollen'; END IF;
  UPDATE public.services SET
    title = 'Rollrasen verlegen lassen',
    short_text = 'Rollrasen verlegen lassen – mit abgestimmter Bodenvorbereitung, Lieferung und Verlegung. Wir klären Bestand, Übergänge, Bewässerung und erste Pflege für Ihre neue Rasenfläche.',
    meta_title = 'Rollrasen verlegen lassen | Loni GalaBau',
    meta_description = 'Rollrasen verlegen lassen: Boden vorbereiten, Lieferung, Verlegung und Erstpflege abstimmen. Loni GalaBau aus Hattersheim – deutschlandweit Projekt anfragen.',
    custom_faqs = '[{"q":"Was kostet es, 100 m² Rollrasen verlegen zu lassen?","a":"Für 100 m² hängt der Gesamtaufwand vor allem vom Ausgangszustand ab. Müssen alter Rasen entfernt, Boden abgefahren oder Höhen angepasst werden, kommen diese Arbeiten zur Lieferung und Verlegung hinzu. Wir klären die einzelnen Positionen für Ihre Fläche; ein Materialpreis allein beschreibt nicht die fertige Rasenanlage."},{"a":"Ein geeigneter Termin hängt von Wetter, Bodenzustand, Materialverfügbarkeit und der anschließenden Bewässerung ab. Wir stimmen die Ausführung für Ihr Vorhaben ab; eine feste Jahreszeit allein ist noch keine Terminentscheidung.","q":"Wann kann Rollrasen verlegt werden?"},{"a":"Das hängt vom Anwachsen, Wetter und der geplanten Belastung ab. Wir besprechen bei der Übergabe, worauf Sie bei Pflege und erster Nutzung achten sollen. Verlegter Rollrasen ist nicht sofort vollständig belastbar.","q":"Wann darf die neue Rasenfläche genutzt werden?"},{"a":"Das Angebot sollte erkennen lassen, welche Bodenvorbereitung, Materialien und Verlegearbeiten vereinbart sind. Rückbau, Abtransport oder zusätzliche Bodenarbeiten können den Umfang verändern und werden für Ihre Fläche abgestimmt.","q":"Was gehört zum Angebot für das Verlegen von Rollrasen?"},{"q":"Kann ich Rollrasen kaufen und verlegen lassen?","a":"Wir stimmen Lieferung und Verlegung im Rahmen des vereinbarten Gartenprojekts gemeinsam ab. Dazu klären wir die Eignung und Vorbereitung des Bodens sowie die anschließende Bewässerung. Vorhandenes oder selbst beschafftes Material besprechen Sie bitte vorab mit uns."}]'::jsonb
  WHERE slug = 'rasenanlagen' AND active = true
    AND updated_at = '2026-10-01 07:44:32.672534+00'::timestamptz;
  GET DIAGNOSTICS changed = ROW_COUNT;
  IF changed <> 1 THEN RAISE EXCEPTION 'Inhaltskonflikt bei rasenanlagen; gesamten Vorgang zurückrollen'; END IF;
END
$keyword_content$;
COMMIT;

# Flerspråklig rubrikk for evaluering av utviklingen av åpent innhold

Et enkelt rammeverk for å sammenligne eksplisitt og implisitt kostnad ved utvikling, og relative forskjeller mellom, forskjellige typer åpent innhold typisk bruk i eLæring. Inspirert av en [rubrikk av Anstey og Watson (2018)](https://er.educause.edu/articles/2018/9/a-rubric-for-evaluating-e-learning-tools-in-higher-education).

Hvert læringsobjekt gis en poengsum basert på en evaluering, det vil si, en vurdering gitt til hver underlagte faktor nedenfor. Verdiene fra disse Likert-skalaene normaliseres, aggregeres for hver faktor, og brukes i et radarkart for å indikere total og relativ kompleksitet mellom typene.

## Bruk

Installer og kjør [http-server](https://www.npmjs.com/package/http-server) fra den nedlastede mappen, eller hvilken som helst annen server-programvare, og rediger `model.js` etter behov. Språk settes i nettleser-parameteret `lang`, `labels` inkluderer data for oversettelse/merkelapper, `data` all data om hvert læringsobjekt.

MIT Lisens 2020 - Ole Vik, NTNU

## Faktor

### Åpenhet

Hvorvidt typen oppfyller [OER-spesifikasjonen](http://opencontent.org/definition/), og resulterer i ressurser som kan bearbeides senere, søkes opp, redigeres med gratis verktøy, og bruker et åpent format. En høy grad av åpenhet betyr at innholdstypen er anvendelig, tilgjengelig for utviklere, og i liten grad låst til gitte systemer.

#### Materiale

`0` - Fullstendig låst  
`1` - Sluttproduktet er tilgjengelig  
`2` - Involverte ressurser er tilgjengelig  
`3` - Kildemateriale (redigerbare ressurser) er tilgjengelig  

#### Gjenfinnbart

`0` - Kan ikke søkes opp  
`1` - Kan ikke søkes opp, men kan ha metadata  
`2` - Kan søkes opp  
`3` - Kan søkes opp, og ha metadata  

#### Verktøy

`0` - Verktøy er proprietære  
`1` - Verktøy er gratis eller tilgjengelig via site-lisens  
`2` - Verktøy er åpne (åpen kildekode)  

#### Format

`0` - Format er lukket og proprietært  
`1` - Format er åpent for diverse programvare  
`2` - Format er åpent for mye programvare  
`3` - Format er åpent og standardisert  

### Tilgjengelighet

Terskelen for bruk for sluttbrukeren, hvor negative aspekter som rigiditet, høy grad av stimuli, og tekniske begrensninger måles. Hvis innholdet ikke tillater at brukeren styrer hvordan det konsumeres, så begrenser dette læringseffekten. At flere sanser involveres kan skape engasjement, men krever som regel også mer konsentrasjon, og det er en fare for at læringseffekten begrenses av overstimuli.

Noe innhold vil også kreve mer teknisk utstyr for bruk, som hever terskelen. Standarder inkluderer her tilgjengelighet for brukere med nedsatt funksjonsevne, i form av syn, hørsel eller mekanikk, samt at innholdet [tydelig kan oppfattes, adskilles, anvendes, forstås og tolkes](https://www.w3.org/WAI/fundamentals/accessibility-principles/).

#### Rigiditet

`0` - Bruker kan ikke endre tempo eller rekkefølge  
`1` - Bruker kan vanskelig styre tempo eller rekkefølge  
`2` - Bruker kan styre tempo og rekkefølge  

#### Stimuli

`1` - Involverer syn, hørsel og berøring  
`2` - Involverer syn og hørsel  
`3` - Involverer syn  

#### Tekniske begrensninger

`1` - Innholdet krever spesiell programvare eller utstyr  
`2` - Innholdet krever moderne nettleser eller utstyr  
`3` - Innholdet kan åpnes med minimal teknisk kompetanse  

#### Standarder

`0` - Praktisk umulig å etterleve standarder for tilgjengelighet  
`1` - Vanskelig å etterleve standarder for tilgjengelighet  
`2` - Overkommelig å etterleve standarder for tilgjengelighet  
`3` - Enkelt å etterleve standarder for tilgjengelighet  

### Utvikling

Nødvendig tid og kompetanse nødvendig for å produsere innholdet. Både tid og teknisk kompetanse er her relativt til andre innholdstyper, ikke absolutte verdier.

#### Tid

`1` - Svært lite  
`2` - Lite  
`3` - Middels  
`4` - Mye  
`5` - Svært mye  

#### Tekniske kompetanse

`1` - Svært lav  
`2` - Lav  
`3` - Middels  
`4` - Høy  
`5` - Svært høy  

### Implementering

Hvor mange personer som antageligvis må bidra for å utvikle innholdet basert på fageksperters innspill, og publisere det.

#### Involverte

`1` - Én  
`2` - To  
`3` - Tre eller flere  
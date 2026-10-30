# Il mio calendario

Applicazione web leggera per consultare un calendario mensile e associare una nota a ciascun giorno. Funziona interamente nel browser, senza account, backend, dipendenze o installazione.

## Funzionalità

- calendario mensile con settimana da lunedì a domenica;
- navigazione tra i mesi e pulsante **Oggi**;
- aggiunta, modifica ed eliminazione di una nota giornaliera;
- anteprima della nota nella relativa cella;
- salvataggio automatico sul dispositivo tramite `localStorage`;
- layout adattivo per desktop e dispositivi mobili;
- supporto alla tastiera e preferenza di movimento ridotto.

## Avvio

Il progetto non richiede build. È sufficiente aprire [`index.html`](./index.html) con un browser moderno.

In alternativa, si può avviare un server statico dalla root del repository. Per esempio, se Python è installato:

```bash
python -m http.server 8000
```

Poi visitare `http://localhost:8000`.

## Utilizzo

1. Usare le frecce per cambiare mese oppure **Oggi** per tornare al mese corrente.
2. Selezionare un giorno per aprire la finestra della nota.
3. Scrivere fino a 500 caratteri e premere **Salva nota**.
4. Selezionare nuovamente il giorno per modificare o eliminare la nota.

La combinazione `Ctrl+Invio` su Windows/Linux o `Cmd+Invio` su macOS salva la nota. `Esc` chiude la finestra senza salvare.

## Persistenza dei dati

Le note sono conservate esclusivamente nel browser tramite `localStorage`, con la chiave:

```text
calendario-note-v1
```

Il valore è un oggetto JSON in cui ogni proprietà è una data locale in formato `YYYY-MM-DD` e il relativo valore è il testo della nota:

```json
{
  "2026-10-30": "Esempio di nota"
}
```

I dati non vengono sincronizzati tra browser o dispositivi. La cancellazione dei dati del sito, l'uso della navigazione privata o un cambio di origine (per esempio porta o protocollo differenti) può renderli indisponibili.

## Struttura del progetto

```text
.
|-- index.html   # struttura HTML dell'applicazione
|-- styles.css   # stili, layout responsive e animazioni
|-- app.js       # logica del calendario e persistenza locale
|-- AGENTS.md    # contesto e indicazioni per gli agenti di sviluppo
`-- README.md    # documentazione del progetto
```

L'applicazione resta priva di dipendenze e non richiede una fase di build. La logica in `app.js` è racchiusa in una IIFE e non espone variabili globali. La griglia contiene sempre 42 celle, così da coprire sei settimane complete; i giorni esterni al mese visibile sono mostrati con uno stile attenuato ma restano selezionabili.

## Tecnologie

- HTML5 semantico;
- CSS custom properties, Grid e media query;
- JavaScript vanilla;
- API browser `Intl.DateTimeFormat` e `localStorage`.

## Sviluppo e test manuale

Non sono configurati package manager, lint, build o test automatici. Dopo una modifica verificare almeno:

- navigazione tra mesi e passaggi di anno;
- ritorno al mese corrente con **Oggi**;
- creazione, aggiornamento ed eliminazione delle note;
- persistenza dopo il ricaricamento della pagina;
- chiusura del dialogo con pulsante, sfondo ed `Esc`;
- uso da tastiera e resa su viewport desktop e mobile.

## Privacy

L'applicazione non invia dati a servizi esterni. Tutto il contenuto inserito rimane nell'archivio locale del browser usato.

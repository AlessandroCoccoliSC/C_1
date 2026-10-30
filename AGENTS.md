# Contesto del progetto

Questo repository contiene una piccola applicazione web di calendario mensile in italiano. Markup, stili CSS e JavaScript sono separati rispettivamente in `index.html`, `styles.css` e `app.js`; non hanno dipendenze esterne e non richiedono una fase di build.

## Funzionalità

- Visualizzazione mensile su una griglia fissa di 6 settimane, con settimana da lunedì a domenica.
- Navigazione al mese precedente, al mese successivo e ritorno al mese corrente.
- Creazione, modifica ed eliminazione di una nota per ciascun giorno.
- Anteprima delle note direttamente nelle celle del calendario.
- Persistenza locale nel browser tramite la chiave `localStorage` `calendario-note-v1`.
- Interfaccia responsive, navigabile da tastiera e dotata di attributi ARIA.

## Struttura tecnica

- `index.html`: struttura HTML e riferimenti ai file CSS e JavaScript.
- `styles.css`: presentazione, layout responsive e animazioni.
- `app.js`: logica del calendario, gestione delle note e persistenza locale.
- `README.md`: documentazione per utilizzo, sviluppo e manutenzione.
- Non sono presenti package manager, framework, backend, test automatici o asset esterni.
- Le date salvate usano chiavi locali nel formato `YYYY-MM-DD`; il valore associato è una stringa di massimo 500 caratteri.
- La lingua e la formattazione delle date sono impostate su `it-IT`.

## Indicazioni per le modifiche

- Conservare l'approccio senza dipendenze e la separazione tra HTML, CSS e JavaScript, salvo richiesta esplicita contraria.
- Non cambiare la chiave o il formato di `localStorage` senza prevedere una migrazione, per non perdere le note esistenti.
- Usare i metodi locali di `Date` per generare le chiavi: la semantica corrente è quella del giorno nel fuso locale dell'utente.
- Inserire il testo delle note con `textContent`, mai con `innerHTML`, per evitare injection di markup.
- Mantenere coerenti accessibilità e navigazione da tastiera: focus visibile, etichette ARIA, chiusura con `Escape`, ripristino del focus e scorciatoia `Ctrl/Cmd+Invio`.
- Verificare le modifiche almeno su viewport desktop e mobile e controllare i passaggi tra mese/anno, i mesi che iniziano di domenica e la persistenza dopo il reload.
- Aggiornare il `README.md` quando cambiano funzionalità, avvio, struttura dei dati o vincoli del progetto.

## Avvio e verifica

Per una prova rapida aprire `index.html` in un browser moderno. Se il browser applica restrizioni alle pagine `file://`, servire la cartella con un server HTTP statico locale. Non esistono al momento comandi di build o test dedicati.

# Projektbeschreibung

Im Rahmen meiner Bachelorarbeit habe ich das Dashboard namens **„ArmTours“** entwickelt. Hierbei handelt es sich um ein System, das von Touristen oder Alleinreisenden genutzt werden kann, um ihre Reise nach Armenien optimal und eigenständig zu planen. Das Dashboard stellt die notwendigen Informationen bereit, die für die Reiseplanung hilfreich sind. Das System kann jedoch auch auf andere Länder übertragen werden.

Das Dashboard soll die ältesten armenischen Kirchen und Sehenswürdigkeiten vorstellen. Neben den historischen Informationen werden auch weitere nützliche Details bereitgestellt, wie die Adresse des Ortes, Öffnungszeiten und zusätzliche Hinweise, die Touristen für ihre Reise benötigen können. Ein zentrales Ziel des Projekts ist es, Armenien den Menschen näherzubringen, die wenig über dieses Land wissen. Da Armenien das erste Land ist, das das Christentum als Staatsreligion akzeptiert hat, stehen die ältesten Kirchen an erster Stelle. Ergänzend dazu können auch Sehenswürdigkeiten erkundet werden, die eine wichtige geschichtliche Bedeutung haben und Touristen als Anreiz dienen können.

Eine nähere Betrachtung der Funktionalitäten dieses Dashboards wird weiter unten ausführlich beschrieben.

## Installationsschritte

Das System läuft momentan nur lokal. Das bedeutet, dass der Anwender einige Voraussetzungen erfüllen muss, um das System zum Laufen zu bringen:

- **Docker Desktop**: Docker wird genutzt, um drei Container – _Frontend_, _Backend_ und _Datenbank_ – zusammenzuführen und parallel arbeiten zu lassen, damit das Dashboard korrekt funktioniert.
- **Docker Compose**: Ein Tool zur Definition und Ausführung von Multi-Container-Docker-Anwendungen.
- **npm**: Ein Paketmanager, der für die Verwaltung der Frontend-Abhängigkeiten benötigt wird.

Nachdem Docker, Docker Compose und npm installiert wurden, folgen diese Schritte:

### 1. Docker-Container starten

```bash
$ docker-compose build
$ docker-compose up -d
```

Nach dem Ausführen dieser Befehle können im Docker-Desktop alle drei Container – _Frontend_, _Backend_ und _Datenbank_ – überprüft werden.

### 2. Frontend starten

Wechseln Sie in den Frontend-Ordner und führen Sie folgende Befehle aus:

```bash
$ cd frontend
$ npm install
$ npm run serve
```

Jetzt sollte das Frontend erfolgreich gestartet sein, und es kann über [http://localhost:8080/](http://localhost:8080/) aufgerufen werden.

## Nutzung des Dashboards

Nach dem Start wird das Dashboard zunächst leer sein, da keine Datenbankmigration eingerichtet ist und die Datenbank in der lokalen Anwendung leer ist. Daher wird beim Aufruf von `http://localhost:8080` zunächst nur eine leere Scrollleiste angezeigt. Unter dieser Scrollleiste befindet sich die Karte von Armenien, die in Provinzen unterteilt ist. 

Wenn man auf eine Provinz klickt, werden dort vorgeschlagene Orte angezeigt. Allerdings sind diese zu Beginn leer, da lokal noch keine Orte hinzugefügt wurden. Um das System vollständig zu testen, kann man sich zunächst registrieren. Danach muss man sich in der lokalen Datenbank anmelden (die Zugangsdaten werden später bereitgestellt) und die Rolle des neu erstellten Benutzers von `user` auf `supersuperuser` ändern. 

Nun hat man die Rechte, neue Orte in das Dashboard hinzuzufügen. Sobald ein neuer Ort hinzugefügt wurde, kann man diesen kommentieren, auf bestehende Kommentare antworten, Kommentare bewerten und den Ort selbst bewerten. Die Bewertung von Kommentaren ist einfacher im Vergleich zur Bewertung von Orten. 

Zusätzlich besteht die Möglichkeit, einen Ort zu einer Sammlung hinzuzufügen. Dafür muss man zunächst in seinem Profil eine Sammlung erstellen. Im Profilbereich kann der Benutzer außerdem Änderungen vornehmen, wie beispielsweise den Vor- und Nachnamen oder das Geburtsdatum bearbeiten. Der Benutzer kann auch ein Profilbild hochladen, das auf verschiedenen Seiten des Dashboards angezeigt wird. 

Darüber hinaus kann der Benutzer die Orte in den erstellten Sammlungen einsehen, direkt von dort aus besuchen oder sie aus der Sammlung entfernen. Die geschriebenen Kommentare werden ebenfalls im Profilbereich angezeigt, sodass der Benutzer direkt zu dem Ort weitergeleitet werden kann, an dem der Kommentar verfasst wurde.

### Rollen im Dashboard

Das Dashboard verfügt über drei Rollen: `supersuperuser`, `superuser` und `user`. 

- **`supersuperuser`**: Hat die vollständige Kontrolle über das Dashboard und kann auf das Admin-Panel zugreifen, in dem alle registrierten Nutzer des Dashboards aufgelistet sind. Der `supersuperuser` kann Nutzer zu `superusern` ernennen, `superuser` zu `usern` herabstufen oder Nutzer komplett aus der Datenbank löschen.
- **`superuser`**: Dient als Moderator und hat ähnliche Funktionen wie der `supersuperuser`, jedoch ohne Zugriff auf das Admin-Panel.
- **`user`**: Kann Kommentare schreiben, Orte bewerten und Sammlungen erstellen, hat jedoch keine moderierenden Funktionen.

### Kommentare und Bewertungen

In den angezeigten Orten werden standardmäßig nur die letzten drei Kommentare und Bewertungen angezeigt. Wenn weitere oder ältere Kommentare und Bewertungen vorhanden sind, erscheint ein Button, mit dem ein Popup geöffnet werden kann. In diesem Popup können alle geschriebenen Kommentare und Bewertungen eingesehen werden.

## Zusatzfunktionen

Die Anwendung bietet zusätzliche Funktionen, die über die explizit genannten Anforderungen hinausgehen. Nutzer können ihr Profil bearbeiten, wobei sie **Name**, **Vorname** und **Geburtsdatum** ändern dürfen – der **Benutzername bleibt unveränderbar**. Zudem besteht die Möglichkeit, ein **eigenes Profilbild hochzuladen**, das bei verschiedenen Interaktionen im Dashboard angezeigt wird.

Auf der **Profilseite** sind alle vom Nutzer verfassten **Kommentare** einsehbar, inklusive direkter **Links zur jeweiligen Seite**, auf der der Kommentar geschrieben wurde.

**Superuser**, die auch als **Moderatoren** agieren, haben die Berechtigung, unangemessene **Kommentare und Bewertungen zu löschen**. Bewertungen enthalten ein zusätzliches **Textfeld für persönliche Meinungen**, welches im Dashboard angezeigt wird und ebenfalls moderiert werden kann.

---

## Nicht-funktionale Anforderungen

### Benutzerfreundlichkeit

Das Dashboard ist **benutzerfreundlich gestaltet** und bietet eine **intuitive Navigation**. Jede Seite enthält eine **kurze textliche Einführung zur Orientierung**. Visuelle Hinweise wie farblich hervorgehobene Buttons – etwa ein **roter Button zum Löschen von Kommentaren** – verbessern die Nutzererfahrung zusätzlich.

### Flexible Layouts

Dank **responsivem Design** passt sich das Dashboard automatisch an verschiedene **Bildschirmgrößen** an.  
- Auf **Standard-Bildschirmen** sind Inhalte gleichmäßig verteilt.  
- Auf **großen Bildschirmen** werden Inhalte verkleinert, um **mehr Informationen gleichzeitig darzustellen**.  
- Auf **kleinen Geräten** wie Smartphones werden die Inhalte **untereinander angeordnet**, um Übersichtlichkeit und Lesbarkeit zu gewährleisten.

### Zugriffskontrollen

Das System implementiert ein klares, **rollenbasiertes Berechtigungskonzept**.  
- **Nicht registrierte Nutzer** haben keinen Zugriff auf geschützte Funktionen wie das **Verfassen von Kommentaren**, **Bewertungen** oder das **Erstellen von Sammlungen**.  
- Der Versuch solcher Aktionen führt zur **Weiterleitung auf die Login-Seite** oder zu einer **Hinweisnachricht**.  
- Zugriff auf das **Adminpanel** und **Moderationsfunktionen** ist ausschließlich **Superusern und Supersuperusern** vorbehalten.

## Implementierungsmöglichkeiten

Da das Dashboard sowohl komplexe funktionale als auch nicht-funktionale Anforderungen erfüllt, ist es wichtig, geeignete Technologien auszuwählen, die die Umsetzung effizient und nachhaltig ermöglichen.

### Frontend mit Vue 3

Für das Frontend kommt **Vue 3** zum Einsatz – ein leistungsfähiges und vielseitiges JavaScript-Framework zur Erstellung moderner Web-Benutzeroberflächen. Eine der größten Stärken von Vue 3 liegt in seiner **Flexibilität**, die es ermöglicht, das Projekt in **viele kleinere, modulare Abschnitte zu unterteilen**. So lassen sich einzelne Komponenten unabhängig voneinander entwickeln, priorisieren und testen, ohne andere Funktionen negativ zu beeinflussen. Diese Trennung der Zuständigkeiten ist besonders hilfreich, da das Dashboard eine Vielzahl an klar voneinander abgegrenzten Features enthält.

### Navigation mit Vue Router

Die Navigation innerhalb der Anwendung wird durch den **Vue Router** gesteuert – einem offiziellen Routing-Tool für Vue.js. Da das Dashboard verschiedene Seiten bietet, wie eine **Hauptseite**, **individuelle Kirchen- und Sehenswürdigkeitsseiten**, eine **Profilseite**, sowie **Login- und Registrierungsansichten**, ist eine saubere Navigation mit **dynamischen Routen** essenziell. Vue Router ermöglicht es, Inhalte basierend auf der aktuellen URL zu laden, was eine nutzerfreundliche und skalierbare Struktur schafft.

### Zustandsverwaltung mit Vuex

Zur Verwaltung des globalen Zustands der Anwendung wird **Vuex** verwendet – eine zentrale Datenablage, auf die verschiedene Komponenten zugreifen können. Funktionen wie **Bewertungen**, **Kommentare**, **Benutzerinformationen** sowie **Kirchen- und Sehenswürdigkeitsdaten** lassen sich effizient in einem gemeinsamen Store verwalten. Dank der **Modularisierungsmöglichkeiten von Vuex** kann der Store in Teilbereiche untergliedert werden, was sowohl die Wartbarkeit als auch die Übersichtlichkeit bei wachsender Komplexität erhöht.

### Backend mit Node.js

Im Backend wird auf **Node.js** gesetzt – eine serverseitige JavaScript-Laufzeitumgebung, die es ermöglicht, sowohl Frontend als auch Backend mit derselben Sprache zu realisieren. Node.js eignet sich hervorragend für **Echtzeitanwendungen** und unterstützt **asynchrone Programmierung**, was besonders bei der Nutzung von **Fetch-APIs** im Frontend wichtig ist, um die Benutzeroberfläche reaktionsfähig zu halten. Darüber hinaus bietet das **npm-Ökosystem** eine Vielzahl nützlicher Bibliotheken, die die Entwicklung beschleunigen und gängige Aufgaben deutlich vereinfachen.

### Datenhaltung mit MySQL

Für die Datenbank kommt **MySQL** zum Einsatz – ein bewährtes relationales Datenbanksystem, das sich besonders für strukturierte Daten eignet. Durch seine Stabilität und weite Verbreitung ist es gut geeignet für die Speicherung und Verwaltung der vielfältigen Inhalte des Dashboards, wie etwa Nutzerprofile, Kommentare, Bewertungen und Kircheninformationen.




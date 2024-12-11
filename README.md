# Projektbeschreibung

Im Rahmen meiner Bachelorarbeit habe ich das Dashboard namens **„ArmTours“** entwickelt. Hierbei handelt es sich um ein System, das von Touristen oder Alleinreisenden genutzt werden kann, um ihre Reise nach Armenien optimal und eigenständig zu planen. Das Dashboard stellt die notwendigen Informationen bereit, die für die Reiseplanung hilfreich sind. Das System kann jedoch auch auf andere Länder übertragen werden.

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

\documentclass{article}
\usepackage[utf8]{inputenc}
\usepackage{hyperref}

\begin{document}

\section*{Projektbeschreibung}

Im Rahmen meiner Bachelorarbeit habe ich das Dashboard namens \textbf{„ArmTours“} entwickelt. Hierbei handelt es sich um ein System, das von Touristen oder Alleinreisenden genutzt werden kann, um ihre Reise nach Armenien optimal und eigenständig zu planen. Das Dashboard stellt die notwendigen Informationen bereit, die für die Reiseplanung hilfreich sind. Das System kann jedoch auch auf andere Länder übertragen werden.

Eine nähere Betrachtung der Funktionalitäten dieses Dashboards wird weiter unten ausführlich beschrieben.

\section*{Installationsschritte}

Das System läuft momentan nur lokal. Das bedeutet, dass der Anwender einige Voraussetzungen erfüllen muss, um das System zum Laufen zu bringen:

\begin{itemize}
    \item \textbf{Docker Desktop}: Docker wird genutzt, um drei Container – \textit{Frontend}, \textit{Backend} und \textit{Datenbank} – zusammenzuführen und parallel arbeiten zu lassen, damit das Dashboard korrekt funktioniert.
    \item \textbf{Docker Compose}: Ein Tool zur Definition und Ausführung von Multi-Container-Docker-Anwendungen.
    \item \textbf{npm}: Ein Paketmanager, der für die Verwaltung der Frontend-Abhängigkeiten benötigt wird.
\end{itemize}

Nachdem Docker, Docker Compose und npm installiert wurden, folgen diese Schritte:

\subsection*{1. Docker-Container starten}

\begin{verbatim}
$ docker-compose build
$ docker-compose up -d
\end{verbatim}

Nach dem Ausführen dieser Befehle können im Docker-Desktop alle drei Container – \textit{Frontend}, \textit{Backend} und \textit{Datenbank} – überprüft werden.

\subsection*{2. Frontend starten}

Wechseln Sie in den Frontend-Ordner und führen Sie folgende Befehle aus:

\begin{verbatim}
$ cd frontend
$ npm install
$ npm run serve
\end{verbatim}

Jetzt sollte das Frontend erfolgreich gestartet sein, und es kann über \url{http://localhost:8080/} aufgerufen werden.

\end{document}

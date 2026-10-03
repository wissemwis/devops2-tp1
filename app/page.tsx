import { Fragment } from "react";
import DevOpsLoop from "@/components/DevOpsLoop";

const features = [
  { title: "Éditeur simple", text: "Questions à choix, réponses libres et barèmes." },
  { title: "Partage par lien", text: "Un lien ou un QR code suffit pour répondre." },
  { title: "Résultats en direct", text: "Scores et statistiques mis à jour à chaque réponse." },
  { title: "Export", text: "Téléchargez les réponses en CSV ou PDF." },
  { title: "Équipes", text: "Travaillez à plusieurs sur un même questionnaire." },
];

const steps = [
  { title: "Concevoir", text: "Rédigez vos questions dans l'éditeur." },
  { title: "Diffuser", text: "Partagez le lien avec vos participants." },
  { title: "Analyser", text: "Consultez les résultats et exportez-les." },
];

const stack = [
  "Front-end Next.js",
  "API Strapi et base PostgreSQL",
  "Conteneurs Docker et Compose",
  "Pipeline CI/CD à chaque commit",
];

const tiles = [
  { kind: "accent", title: "Côté Dev", text: "Planifier, coder, construire et tester." },
  { kind: "ops", title: "Côté Ops", text: "Livrer, déployer, exploiter et surveiller." },
  { kind: "good", title: "Bonne pratique", text: "Chaque modification passe par une revue et des tests automatisés." },
  { kind: "warn", title: "Attention", text: "Ceci est un site fictif créé pour un TP : aucun service réel n'est proposé." },
];

export default function Home() {
  return (
    <>
      <nav className="nav">
        <div className="container">
          <a className="brand" href="#">
            <span className="brand-mark">Q</span>
            Quizzo
          </a>
          <ul className="nav-links">
            <li><a href="#fonctionnalites">Fonctionnalités</a></li>
            <li><a href="#fonctionnement">Fonctionnement</a></li>
            <li><a href="#technique">Technique</a></li>
          </ul>
          <a className="btn btn-primary" href="#commencer">Commencer</a>
        </div>
      </nav>

      <header className="hero">
        <div className="container">
          <div>
            <div className="eyebrow">Plateforme de questionnaires · Site fictif</div>
            <h1>Votre questionnaire prêt en 5 minutes</h1>
            <p className="lead">
              Quizzo vous aide à concevoir des quiz en quelques minutes et à suivre les résultats en temps réel.
            </p>
            <div className="hero-actions">
              <a className="btn btn-primary" href="#commencer">Créer un questionnaire</a>
              <a className="btn btn-ghost" href="#fonctionnement">Voir comment ça marche</a>
            </div>
            <span className="pill">DevOps 2 · TP1</span>
          </div>
          <DevOpsLoop className="loop" />
        </div>
      </header>

      <section id="fonctionnalites">
        <div className="container">
          <div className="section-head">
            <h2>Fonctionnalités</h2>
            <p>Tout ce qu'il faut pour mener une évaluation de bout en bout.</p>
          </div>
          <div className="cards">
            {features.map((f, i) => (
              <div className="card" key={f.title}>
                <div className="num">{String(i + 1).padStart(2, "0")}</div>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="fonctionnement" className="section-surface">
        <div className="container">
          <div className="section-head">
            <h2>Comment ça marche</h2>
            <p>Trois étapes, de l'idée aux résultats.</p>
          </div>
          <div className="steps">
            {steps.map((s, i) => (
              <Fragment key={s.title}>
                {i > 0 && <div className="arrow" aria-hidden="true">→</div>}
                <div className="step">
                  <div className="circle">{i + 1}</div>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </div>
              </Fragment>
            ))}
          </div>
          <div className="banner">Un questionnaire prêt à diffuser en moins de 5 minutes.</div>
        </div>
      </section>

      <section id="technique">
        <div className="container">
          <div className="section-head">
            <h2>Sous le capot</h2>
            <p>Une stack moderne, livrée en continu.</p>
          </div>
          <div className="split">
            <pre className="code">
              <span className="c"># Lancer Quizzo en local</span>
              {"\ngit clone https://example.com/quizzo.git\ncd quizzo\n"}
              <span className="hl">docker compose up -d</span>
              {"\n"}
              <span className="c"># Front : http://localhost:3000</span>
              {"\n"}
              <span className="c"># API   : http://localhost:1337</span>
            </pre>
            <ul className="checks">
              {stack.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="grid-2">
            {tiles.map((t) => (
              <div className={`tile ${t.kind}`} key={t.title}>
                <h3>{t.title}</h3>
                <p>{t.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="commencer" className="quote">
        <DevOpsLoop className="watermark" watermark />
        <div className="container">
          <blockquote>« Une bonne question vaut mieux qu'une longue réponse. »</blockquote>
          <div className="actions">
            <a className="btn btn-white" href="#">Créer mon premier quiz</a>
          </div>
        </div>
      </section>

      <footer>
        <div className="container">
          <span>Quizzo · Site fictif réalisé pour DevOps 2 — TP1</span>
          <span>&copy; 2026</span>
        </div>
      </footer>
    </>
  );
}

import { Link } from "react-router-dom";
import { api } from "../lib/api";
import { useFetch } from "../lib/useFetch";
import { useSociety } from "../lib/society";
import { useTitle } from "../lib/useTitle";
import { HikeCard } from "../components/HikeCard";
import { HikeImage, Placeholder } from "../components/Placeholder";
import { Icon } from "../components/Icon";
import { Lightbox } from "../components/Lightbox";
import { motion, container, item, iconHover, iconSpring } from "../components/motion";
import { useState } from "react";
import type { GalleryItem } from "../types";

const MotionLink = motion.create(Link);

const VALUES = [
  { icon: "compass", title: "Vodeni pohodi", text: "Izkušeni vodniki poskrbijo za varne in doživete ture po vsej Sloveniji in čez mejo." },
  { icon: "heart", title: "Dobra družba", text: "Pri nas štejejo prijateljstvo, povezanost in skupna ljubezen do gora ter narave." },
  { icon: "leaf", title: "Spoštljivo do narave", text: "V gore stopamo odgovorno – po označenih poteh in z najmanjšim možnim odtisom." },
];

export function Home() {
  const society = useSociety();
  const { data: past } = useFetch(() => api.getHikes({ status: "past" }), []);
  const { data: gallery } = useFetch(() => api.getGallery(), []);
  const [lb, setLb] = useState<number | null>(null);
  useTitle(undefined, society?.tagline);

  const featured = (past ?? []).slice(0, 3);
  const gItems: GalleryItem[] = (gallery ?? []).slice(0, 8);
  const phoneTel = (society?.phone ?? "").replace(/\s+/g, "");

  const stats = [
    { icon: "calendar", value: society?.founded, label: "Leto ustanovitve" },
    { icon: "users", value: society?.memberCount, label: "Članov" },
    { icon: "mountain", value: society?.hikesPerYear, label: "Pohodov letno" },
  ];

  return (
    <>
      <section className="hero">
        <div className="hero-bg">
          <Placeholder seed="goricko-tromeja-hero" />
        </div>
        <div className="container hero-inner">
          <motion.div className="hero-content" variants={container} initial="hidden" animate="show">
            <motion.span className="pill" variants={item}>
              <span className="dot" aria-hidden="true" /> Planinsko društvo na tromeji treh dežel
            </motion.span>
            <motion.h1 variants={item}>Skupaj odkrivamo lepote gora in narave.</motion.h1>
            <motion.p className="lead" variants={item}>
              Vodeni pohodi, izleti in družabni dogodki za vse generacije – od lahkih sprehodov po
              gričevnatem Goričkem do vzponov na najvišje slovenske vrhove.
            </motion.p>
            <motion.div className="actions" variants={item}>
              <Link to="/pohodi" className="btn btn-primary btn-lg">
                Naši pohodi <Icon name="arrow-right" />
              </Link>
              <Link to="/kontakt" className="btn btn-outline btn-lg">
                Pridruži se nam
              </Link>
            </motion.div>
            <motion.dl className="hero-stats" variants={item}>
              {stats.map((s) => (
                <div className="stat" key={s.label}>
                  <Icon name={s.icon} />
                  <dt className="sr-only">{s.label}</dt>
                  <dd className="val">{s.value}</dd>
                  <p className="lbl">{s.label}</p>
                </div>
              ))}
            </motion.dl>
          </motion.div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="flex-between">
            <div className="section-heading">
              <span className="eyebrow">Zadnji pohodi</span>
              <h2>Kje vse smo že bili</h2>
              <p>Utrinki z naših zadnjih pohodov. Spremljaj nas za nove termine in se nam pridruži.</p>
            </div>
            <Link to="/pohodi" className="btn btn-outline">
              Prihodnji pohodi <Icon name="arrow-right" />
            </Link>
          </div>
          {featured.length > 0 ? (
            <motion.div
              className="grid grid-3 mt-8"
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.15 }}
            >
              {featured.map((h) => (
                <motion.div key={h.id} variants={item}>
                  <HikeCard hike={h} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <p className="empty">Trenutno ni razpisanih pohodov. Spremljaj nas za nove termine.</p>
          )}
        </div>
      </section>

      <section className="section section--sand">
        <div className="container split">
          <div className="media-frame">
            <HikeImage src="/uploads/thumbnail.jpg" alt="Člani PD Goričko – Tromeja" seed="o-drustvu-preview" />
          </div>
          <div>
            <div className="section-heading">
              <span className="eyebrow">O društvu</span>
              <h2>Več kot 20 let v objemu gora</h2>
              <p>{society?.about}</p>
            </div>
            <Link to="/o-drustvu" className="btn btn-primary mt-8">
              Več o nas <Icon name="arrow-right" />
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-heading center">
            <span className="eyebrow">Zakaj z nami</span>
            <h2>Tri stvari, ki nas povezujejo</h2>
          </div>
          <div className="grid grid-3 mt-8">
            {VALUES.map((v) => (
              <div className="feature center" key={v.title}>
                <span className="icon-badge center">
                  <Icon name={v.icon} />
                </span>
                <h3>{v.title}</h3>
                <p>{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--sand">
        <div className="container">
          <div className="flex-between">
            <div className="section-heading">
              <span className="eyebrow">Galerija</span>
              <h2>Utrinki z naših poti</h2>
              <p>Nekaj trenutkov, ujetih na pohodih. Kliknite za večji prikaz.</p>
            </div>
            <Link to="/galerija" className="btn btn-outline">
              Vsa galerija <Icon name="arrow-right" />
            </Link>
          </div>
          <div className="gallery-grid mt-8">
            {gItems.map((g, i) => (
              <button key={`${g.slug}-${g.i}`} type="button" onClick={() => setLb(i)} aria-label={`Povečaj: ${g.title}`}>
                <HikeImage src={g.src} alt={g.title} seed={`${g.slug}-${g.i}`} />
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="cta-band">
            <div className="bg">
              <HikeImage src="/uploads/pridruzi-se.jpg" alt="" seed="cta-band" />
            </div>
            <div className="inner">
              <h2>Postani član in stopi z nami na pot</h2>
              <p>Članstvo je odprto za vse generacije. Pridruži se skupnosti pohodnikov, ki jih druži ljubezen do narave.</p>
              <div className="actions">
                <Link to="/kontakt" className="btn btn-secondary btn-lg">
                  Pridruži se nam
                </Link>
                <Link to="/pohodi" className="btn btn-ghost btn-lg">
                  Poglej pohode
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <motion.div
            className="contact-cards"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.a className="contact-card" href={`mailto:${society?.email ?? ""}`} variants={{ ...item, hover: { y: -5 } }} whileHover="hover">
              <motion.span className="ic" variants={iconHover} transition={iconSpring}><Icon name="mail" /></motion.span>
              <span><span className="lbl">E-pošta</span><span className="val">{society?.email}</span></span>
            </motion.a>
            <motion.a className="contact-card" href={`tel:${phoneTel}`} variants={{ ...item, hover: { y: -5 } }} whileHover="hover">
              <motion.span className="ic" variants={iconHover} transition={iconSpring}><Icon name="phone" /></motion.span>
              <span><span className="lbl">Telefon</span><span className="val">{society?.phone}</span></span>
            </motion.a>
            <MotionLink className="contact-card" to="/kontakt" variants={{ ...item, hover: { y: -5 } }} whileHover="hover">
              <motion.span className="ic" variants={iconHover} transition={iconSpring}><Icon name="map-pin" /></motion.span>
              <span><span className="lbl">Naslov</span><span className="val">{society?.address}</span></span>
            </MotionLink>
          </motion.div>
        </div>
      </section>

      {lb !== null && (
        <Lightbox
          items={gItems.map((g) => ({ src: g.src, caption: g.title }))}
          index={lb}
          onClose={() => setLb(null)}
          onChange={setLb}
        />
      )}
    </>
  );
}

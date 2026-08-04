"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  CalendarDays,
  Check,
  ChevronRight,
  FishSymbol,
  Info,
  LifeBuoy,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import { getDemoConditions, locations, species } from "@/lib/data/seed";
import { calculateOpportunity } from "@/lib/domain/scoring";

const techniques = ["Surfcasting", "Spinning", "Boia", "Fundo leve"];
const budgets = [
  "Essencial · até 100 €",
  "Equilibrado · 100–250 €",
  "Especializado · mais de 250 €",
];
const inputClass =
  "mt-2 min-h-12 w-full rounded-xl border border-ink/15 bg-white px-3.5 text-sm font-semibold outline-none transition focus:border-atlantic focus:ring-2 focus:ring-atlantic/10";

function RigDiagram({ technique }: { technique: string }) {
  return (
    <div className="rounded-2xl bg-ink p-4 text-white">
      <p className="data-label text-white/45">
        Montagem indicativa · {technique}
      </p>
      <svg
        role="img"
        aria-label={`Diagrama de montagem para ${technique}`}
        viewBox="0 0 480 130"
        className="mt-3 w-full"
      >
        <path
          d="M24 28h102c40 0 48 47 88 47h154"
          fill="none"
          stroke="#e8f3f0"
          strokeWidth="3"
        />
        <circle cx="214" cy="75" r="7" fill="#f4a621" />
        <path d="M368 75v35" stroke="#e8f3f0" strokeWidth="3" />
        <path d="M349 109h38l-19 13Z" fill="#6bd6d0" />
        <path
          d="M126 28v62"
          stroke="#e8f3f0"
          strokeWidth="2"
          strokeDasharray="4 4"
        />
        <path
          d="M126 90c18 0 18 22 3 22-10 0-10-10-2-13"
          fill="none"
          stroke="#f4a621"
          strokeWidth="3"
        />
        <text x="20" y="18" fill="rgba(255,255,255,.55)" fontSize="12">
          linha principal
        </text>
        <text x="104" y="126" fill="rgba(255,255,255,.55)" fontSize="12">
          anzol + isco
        </text>
        <text x="192" y="62" fill="rgba(255,255,255,.55)" fontSize="12">
          destorcedor
        </text>
        <text x="390" y="115" fill="rgba(255,255,255,.55)" fontSize="12">
          chumbada
        </text>
      </svg>
    </div>
  );
}

export function Planner() {
  const [locationId, setLocationId] = useState(locations[0].id);
  const [speciesId, setSpeciesId] = useState(species[0].id);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [time, setTime] = useState("06:00–12:00");
  const [experience, setExperience] = useState("Iniciante");
  const [budget, setBudget] = useState(budgets[1]);
  const [technique, setTechnique] = useState(techniques[0]);
  const [expected, setExpected] = useState("Ondulação moderada");
  const [generated, setGenerated] = useState(false);
  const location =
    locations.find((item) => item.id === locationId) ?? locations[0];
  const target = species.find((item) => item.id === speciesId) ?? species[0];
  const result = useMemo(
    () =>
      calculateOpportunity({
        location,
        targetSpecies: target,
        conditions: getDemoConditions(),
        now: new Date(`${date}T08:00:00`),
      }),
    [date, location, target],
  );
  const recommendations = [
    {
      title: "Cana e carreto",
      value:
        technique === "Spinning"
          ? "Cana 2,70–3,00 m, ação média + carreto 4000"
          : "Cana surfcasting 4,20 m + carreto long cast",
      why: `Categoria estável para ${technique.toLowerCase()} em ${location.type.replace("_", " ")}; ajuste à sua capacidade física.`,
    },
    { title: "Linha e baixada", value: target.line, why: target.leader },
    {
      title: "Anzol",
      value: target.hook,
      why: "O tamanho final depende do isco e deve ser compatível com as regras atuais, ainda por validar.",
    },
    {
      title: "Chumbada ou amostra",
      value:
        technique === "Spinning"
          ? "Amostra 15–30 g; opção mais leve com vento fraco"
          : "Chumbada 100–130 g, forma ajustada à corrente",
      why: `Faixa indicativa para ${expected.toLowerCase()}; nunca aumente peso além da capacidade declarada da cana.`,
    },
    {
      title: "Iscos",
      value: target.naturalBaits.slice(0, 3).join(" · "),
      why: `Opções biologicamente plausíveis para ${target.commonName}; disponibilidade e eficácia local por validar.`,
    },
  ];
  return (
    <div className="grid gap-5 xl:grid-cols-[430px_1fr]">
      <section className="surface h-fit p-5 sm:p-7">
        <div className="flex items-center justify-between">
          <div>
            <p className="eyebrow">Viagem + equipamento</p>
            <h2 className="mt-1 font-display text-3xl tracking-tight">
              Defina o essencial
            </h2>
          </div>
          <CalendarDays className="text-sea" />
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
          <label className="text-xs font-bold text-ink/65">
            Local
            <select
              className={inputClass}
              value={locationId}
              onChange={(event) => {
                setLocationId(event.target.value);
                setGenerated(false);
              }}
            >
              {locations.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.publicName}
                </option>
              ))}
            </select>
          </label>
          <label className="text-xs font-bold text-ink/65">
            Data
            <input
              className={inputClass}
              type="date"
              value={date}
              onChange={(event) => {
                setDate(event.target.value);
                setGenerated(false);
              }}
            />
          </label>
          <label className="text-xs font-bold text-ink/65">
            Tempo disponível
            <select
              className={inputClass}
              value={time}
              onChange={(event) => setTime(event.target.value)}
            >
              <option>06:00–12:00</option>
              <option>12:00–18:00</option>
              <option>18:00–22:00</option>
              <option>2 horas flexíveis</option>
            </select>
          </label>
          <label className="text-xs font-bold text-ink/65">
            Espécie-alvo
            <select
              className={inputClass}
              value={speciesId}
              onChange={(event) => setSpeciesId(event.target.value)}
            >
              {species.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.commonName}
                </option>
              ))}
            </select>
          </label>
          <label className="text-xs font-bold text-ink/65">
            Experiência
            <select
              className={inputClass}
              value={experience}
              onChange={(event) => setExperience(event.target.value)}
            >
              <option>Iniciante</option>
              <option>Intermédio</option>
              <option>Experiente</option>
            </select>
          </label>
          <label className="text-xs font-bold text-ink/65">
            Orçamento
            <select
              className={inputClass}
              value={budget}
              onChange={(event) => setBudget(event.target.value)}
            >
              {budgets.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label className="text-xs font-bold text-ink/65">
            Técnica
            <select
              className={inputClass}
              value={technique}
              onChange={(event) => setTechnique(event.target.value)}
            >
              {techniques.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label className="text-xs font-bold text-ink/65">
            Condições esperadas
            <select
              className={inputClass}
              value={expected}
              onChange={(event) => setExpected(event.target.value)}
            >
              <option>Mar calmo</option>
              <option>Ondulação moderada</option>
              <option>Vento lateral</option>
              <option>Corrente forte</option>
            </select>
          </label>
        </div>
        <button
          onClick={() => setGenerated(true)}
          className="button-primary mt-6 w-full"
        >
          <Sparkles size={17} /> Criar plano <ChevronRight size={17} />
        </button>
        <p className="mt-3 flex gap-2 text-xs leading-5 text-ink/50">
          <Info size={14} className="mt-0.5 shrink-0" /> O material é explicável
          e não patrocinado. As regras legais são consultadas nas fontes
          oficiais.
        </p>
      </section>
      <section className="space-y-5">
        {!generated ? (
          <div className="surface grid min-h-[540px] place-items-center p-8 text-center">
            <div className="max-w-sm">
              <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-foam text-sea">
                <FishSymbol size={30} />
              </span>
              <h2 className="mt-5 font-display text-3xl tracking-tight">
                O seu plano aparece aqui
              </h2>
              <p className="mt-2 text-sm leading-6 text-ink/55">
                Escolha local, espécie, técnica e condições. O plano cruza os
                dados e explica os critérios usados em cada sugestão de material.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="rounded-[24px] bg-[#5a251f] p-5 text-white shadow-lift sm:p-7">
              <div className="flex gap-4">
                <ShieldAlert className="shrink-0 text-amber" size={25} />
                <div>
                  <p className="eyebrow text-white/50">
                    Plano de {date} · {time}
                  </p>
                  <h2 className="mt-1 font-display text-3xl">Índice de condições: {result.score ?? "—"}/100</h2>
                  <p className="mt-2 text-sm leading-6 text-white/70">
                    {result.score === null ? result.safety.blocks[0]?.detail : result.disclaimer}
                  </p>
                </div>
              </div>
            </div>
            <div className="surface p-5 sm:p-7">
              <div className="flex items-center justify-between">
                <div>
                  <p className="eyebrow">Checklist técnico</p>
                  <h2 className="mt-1 font-display text-3xl tracking-tight">
                    {target.commonName} · {technique}
                  </h2>
                </div>
                <span className="chip">
                  {experience} · {budget.split(" · ")[0]}
                </span>
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {recommendations.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-ink/10 bg-white p-4"
                  >
                    <p className="data-label">{item.title}</p>
                    <strong className="mt-2 block leading-snug">
                      {item.value}
                    </strong>
                    <p className="mt-2 text-xs leading-5 text-ink/55">
                      {item.why}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <RigDiagram technique={technique} />
              </div>
            </div>
            <div className="grid gap-5 lg:grid-cols-2">
              <div className="surface p-5">
                <div className="flex items-center gap-2">
                  <LifeBuoy className="text-sea" />
                  <h3 className="font-display text-2xl">Preparação</h3>
                </div>
                <ul className="mt-4 space-y-2 text-sm">
                  {[
                    "Calçado aderente e roupa adaptada",
                    "Colete de flutuação em margem exposta",
                    "Lanterna frontal se houver pouca luz",
                    "Telemóvel protegido e contacto de emergência",
                    "Nunca pescar sozinho em zona desconhecida",
                  ].map((item) => (
                    <li key={item} className="flex gap-2">
                      <Check size={16} className="mt-0.5 shrink-0 text-sea" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="surface p-5">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="text-amber" />
                  <h3 className="font-display text-2xl">Lembretes legais</h3>
                </div>
                <ul className="mt-4 space-y-2 text-sm">
                  <li className="flex gap-2">
                    <Check size={16} className="mt-0.5 shrink-0" />
                    Confirmar licença adequada na DGRM.
                  </li>
                  <li className="flex gap-2">
                    <Check size={16} className="mt-0.5 shrink-0" />
                    Confirmar tamanhos, defesos e limites atuais.
                  </li>
                  <li className="flex gap-2">
                    <Check size={16} className="mt-0.5 shrink-0" />
                    Consultar editais da Capitania e sinalização local.
                  </li>
                </ul>
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

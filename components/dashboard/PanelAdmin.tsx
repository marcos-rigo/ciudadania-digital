import { Info, CheckCircle2, ExternalLink, FileText } from 'lucide-react'

const FORMS_URL =
  'https://forms.cloud.microsoft/Pages/ResponsePage.aspx?id=Rpc9hHQGv0ikAqRc0G9UGkpr6Cx7gw5EiCOXAv93xnJURUJITk5OUFg3TUhQVTFFTVpRTlROTzhUSC4u'

const pasos = [
  {
    n: 1,
    title: 'Completá el formulario',
    desc: 'Ingresá los datos de la actividad realizada: nombre, fecha, descripción y área.',
  },
  {
    n: 2,
    title: 'Las respuestas se guardan automáticamente',
    desc: 'Cada envío queda registrado de inmediato en la planilla de Excel compartida del equipo.',
    badge: 'Automático · Microsoft Forms + Excel',
  },
  {
    n: 3,
    title: 'Los datos se sincronizan con el tablero de análisis',
    desc: 'La planilla alimenta un tablero de Power BI para visualizar los indicadores en tiempo real.',
    badge: 'Visualización en Power BI',
  },
  {
    n: 4,
    title: '¿Enviaste algo con error?',
    desc: 'No re-envíes el formulario. Avisá al responsable para corregirlo en la planilla.',
  },
]

export function PanelAdmin() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-[#e8edf3] shadow-sm p-8">
        <h2 className="text-[#1A2A36] font-black text-xl flex items-center gap-2 mb-2">
          <span className="w-8 h-8 bg-[#4272bb] rounded-lg flex items-center justify-center flex-shrink-0">
            <Info className="text-white w-4 h-4" />
          </span>
          ¿Cómo funciona el sistema de carga?
        </h2>
        <p className="text-[#64748b] text-sm mb-6">
          Seguí estos pasos cada vez que registres una actividad de la Secretaría.
        </p>
        <div className="space-y-3">
          {pasos.map(p => (
            <div
              key={p.n}
              className="flex gap-4 items-start p-4 rounded-xl bg-[#f6f7f8] border border-[#e2e8f0] hover:border-[#4272bb] hover:shadow-sm transition-all"
            >
              <div className="w-9 h-9 bg-[#4272bb] text-white rounded-full flex items-center justify-center font-black text-sm flex-shrink-0">
                {p.n}
              </div>
              <div>
                <h5 className="font-bold text-[#1A2A36] text-sm mb-0.5">{p.title}</h5>
                <p className="text-[#4a5568] text-xs leading-relaxed">{p.desc}</p>
                {p.badge && (
                  <span className="inline-flex items-center gap-1 mt-1.5 bg-green-100 text-green-700 text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3" />
                    {p.badge}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center">
        <a
          href={`${FORMS_URL}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-[#4272bb] hover:bg-[#2d5a9e] text-white font-bold px-8 py-3.5 rounded-full shadow-[0_4px_16px_rgba(66,114,187,.3)] hover:shadow-[0_8px_22px_rgba(66,114,187,.35)] transition-all hover:-translate-y-0.5"
        >
          <ExternalLink className="w-4 h-4" />
          Abrir formulario en pantalla completa
        </a>
      </div>

      <div className="bg-white rounded-2xl border border-[#e8edf3] shadow-sm p-6">
        <h2 className="text-[#1A2A36] font-black flex items-center gap-2 mb-5">
          <span className="w-8 h-8 bg-[#4272bb] rounded-lg flex items-center justify-center flex-shrink-0">
            <FileText className="text-white w-4 h-4" />
          </span>
          Datos para Informe de Gestión 2026
        </h2>
        <div className="rounded-xl overflow-hidden border border-[#e2e8f0]">
          <iframe
            src={`${FORMS_URL}&embed=true`}
            style={{ display: 'block', width: '100%', height: '720px', border: 'none' }}
            allowFullScreen
            title="Formulario de carga de actividades"
          />
        </div>
      </div>
    </div>
  )
}

"use client";

export default function WorkflowAdminPage() {
  return (
    <div className="workflow-reset-admin">
      <div className="workflow-reset-admin__header">
        <div>
          <h2>İŞ AKIŞ SÜRECİ</h2>
          <p>
            Bu alan tamamen sıfırlandı. Eski veri girişleri, kayıtlı içerikler ve yönetim
            katmanları kaldırıldı.
          </p>
        </div>
      </div>

      <div className="workflow-reset-admin__panel">
        <span className="workflow-reset-admin__badge">RESET TEMPLATE</span>
      </div>

      <style jsx>{`
        .workflow-reset-admin {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          max-width: 960px;
        }

        .workflow-reset-admin__header {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .workflow-reset-admin__header h2 {
          margin: 0;
          color: var(--text);
          letter-spacing: 0.18em;
          font-size: 1.35rem;
        }

        .workflow-reset-admin__header p {
          margin: 0;
          max-width: 42rem;
          color: var(--text-muted);
          line-height: 1.7;
        }

        .workflow-reset-admin__panel {
          min-height: 320px;
          border-radius: 20px;
          border: 1px dashed rgba(166, 137, 102, 0.32);
          background:
            linear-gradient(135deg, rgba(166, 137, 102, 0.08), rgba(255, 255, 255, 0.01)),
            repeating-linear-gradient(
              0deg,
              rgba(255, 255, 255, 0.03),
              rgba(255, 255, 255, 0.03) 1px,
              transparent 1px,
              transparent 32px
            );
          position: relative;
        }

        .workflow-reset-admin__badge {
          position: absolute;
          top: 1.5rem;
          left: 1.5rem;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.45rem 0.7rem;
          border-radius: 999px;
          border: 1px solid rgba(166, 137, 102, 0.28);
          color: #a68966;
          font-size: 0.65rem;
          font-weight: 800;
          letter-spacing: 0.18em;
        }
      `}</style>
    </div>
  );
}

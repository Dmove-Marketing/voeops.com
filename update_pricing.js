const fs = require('fs');

const code = `---
import DotGrid from './DotGrid.astro';

interface Props {
  showLink?: boolean;
}

const { showLink = false } = Astro.props;

const plans = [
  {
    name: 'Starter',
    desc: 'Para quem precisa trocar planilha e WhatsApp solto por um CRM com WhatsApp de verdade.',
    monthly: { price: '387', extra: '129' },
    annual: { price: '330', extra: '110' },
    users: '3 usuários inclusos',
    features: [
      'Inbox WhatsApp nativo',
      'WhatsApp API Oficial + API Voe',
      'Funil de vendas',
      'Negociações e contatos ilimitados',
      'Relatórios básicos de vendas',
      'Distribuição inteligente de leads',
      '1 GB de mídia por usuário',
    ],
    ctaLabel: 'Agendar demonstração',
    ctaStyle: 'outline',
    ctaIntent: 'demo',
  },
  {
    name: 'Growth',
    desc: 'Para quem quer o vendedor focado em vender, não em fazer follow-up manual e controlar agenda na mão.',
    monthly: { price: '687', extra: '229' },
    annual: { price: '585', extra: '195' },
    users: '3 usuários inclusos',
    features: [
      'Tudo do Starter',
      'Módulo de agenda',
      'Múltiplos funis simultâneos',
      'Agendamento de envio de WhatsApp',
      'Automações com ações internas (até 3)',
      'Relatórios completos de funil',
      '3 GB de mídia por usuário',
    ],
    ctaLabel: 'Agendar demonstração',
    ctaStyle: 'outline',
    ctaIntent: 'demo',
  },
  {
    name: 'Scale',
    featured: true,
    badge: 'Mais escolhido',
    desc: 'Para quem quer automação completa, campanhas ativas, segmentação inteligente e visão total da operação.',
    monthly: { price: '1.686', extra: '329' },
    annual: { price: '1.434', extra: '280' },
    users: '3 usuários inclusos',
    features: [
      'Tudo do Starter e Growth',
      'Audiências com segmentação avançada',
      'Campanhas em massa (até 10 mil/mês)',
      'Automações (até 10 ativas)',
      'Botão de WhatsApp e formulários no site',
      'Relatórios avançados de marketing',
      '6 GB de mídia por usuário',
    ],
    ctaLabel: 'Agendar demonstração',
    ctaStyle: 'solid',
    ctaIntent: 'demo',
  },
  {
    name: 'Enterprise',
    desc: 'Para operações com volume, personalização ou governança que pedem proposta sob medida.',
    monthly: { price: 'consulta', extra: '' },
    annual: { price: 'consulta', extra: '' },
    users: 'Proposta sob medida',
    features: [
      'Tudo do Starter, Growth e Scale',
      'Audiências e campanhas com volume sob medida',
      'Automações ilimitadas',
      'Gerente de conta dedicado',
      'SLA e governança personalizados',
      'Armazenamento de mídia sob medida',
    ],
    ctaLabel: 'Fale com a gente',
    ctaStyle: 'outline',
    ctaIntent: 'contato',
  },
];
---

<section id="planos" class="planos-section">
  <DotGrid />
  <div class="container">
    <div class="planos-head">
      <div>
        <div class="eyebrow eyebrow--terracotta" data-animate="fade-up">Planos e preços</div>
        <h2 class="section-title" data-animate="fade-up" data-delay="0.1">Planos que crescem<br>com o seu <em>time</em></h2>
        <p class="section-sub" data-animate="fade-up" data-delay="0.2">Todos os planos incluem 3 usuários. Anual com 15% de desconto.</p>
      </div>
      <div class="plans-toggle" role="tablist" aria-label="Ciclo de cobrança" data-animate="fade-up" data-delay="0.3">
        <button type="button" class="plans-toggle-btn" data-cycle="monthly" role="tab" aria-selected="false">Mensal</button>
        <button type="button" class="plans-toggle-btn is-active" data-cycle="annual" role="tab" aria-selected="true">Anual <span class="plans-toggle-tag">−15%</span></button>
      </div>
    </div>

    <div class="planos-grid is-annual" data-animate="fade-up" data-delay="0.4">
      {plans.map((plan) => (
        <div class={\`plano-card \${plan.featured ? 'plano-card--featured' : ''}\`}>
          {plan.badge && <span class="best-tag">{plan.badge}</span>}
          <div class="plan-name">{plan.name}</div>
          <div class="plan-desc">{plan.desc}</div>

          {plan.monthly.price === 'consulta' ? (
            <>
              <div class="plan-price-block" data-cycle="monthly">
                <div class="price-label">Mensal</div>
                <div class="price-row">
                  <span class="price-val-consult">Sob consulta</span>
                </div>
                <div class="price-sub">{plan.users}</div>
              </div>
              <div class="plan-price-block" data-cycle="annual">
                <div class="price-label price-label--discount">Anual</div>
                <div class="price-row">
                  <span class="price-val-consult">Sob consulta</span>
                </div>
                <div class="price-sub">{plan.users}</div>
              </div>
            </>
          ) : (
            <>
              <div class="plan-price-block" data-cycle="monthly">
                <div class="price-label">Mensal</div>
                <div class="price-row">
                  <span class="price-cur">R$</span><span class="price-val">{plan.monthly.price}</span><span class="price-period"> /mês</span>
                </div>
                <div class="price-sub">{plan.users}</div>
                <div class="price-plus-row">
                  <span class="price-plus-sign">+</span><span class="price-cur">R$</span><span class="price-val-sec">{plan.monthly.extra}</span><span class="price-period"> por usuário adicional</span>
                </div>
              </div>
              <div class="plan-price-block" data-cycle="annual">
                <div class="price-label price-label--discount">Anual −15%</div>
                <div class="price-row">
                  <span class="price-cur">R$</span><span class="price-val">{plan.annual.price}</span><span class="price-period"> /mês</span>
                </div>
                <div class="price-sub">{plan.users}</div>
                <div class="price-plus-row">
                  <span class="price-plus-sign">+</span><span class="price-cur">R$</span><span class="price-val-sec">{plan.annual.extra}</span><span class="price-period"> por usuário adicional</span>
                </div>
              </div>
            </>
          )}

          <div class="plan-sep"></div>
          
          <ul class="plan-items">
            {plan.features.map((feat) => (
              <li class="plan-item">
                <div class="check-ico">
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1.5 5L3.8 7.5L8.5 2" stroke="#00C5B4" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                </div>
                {feat}
              </li>
            ))}
          </ul>
          
          <a class={\`plan-cta cta-\${plan.ctaStyle}\`} href="#" data-chat-intent={plan.ctaIntent}>{plan.ctaLabel}</a>
        </div>
      ))}
    </div>

    {showLink && (
      <a href="/planos" class="pricing-link" data-animate="fade-up" data-delay="0.5">Ver comparativo completo de planos e adicionais de IA →</a>
    )}
  </div>
</section>

<style>
  /* ——— Section: Pricing ——— */
  .planos-section { background: var(--offwhite-3); padding: 110px 0; position: relative; overflow: hidden; }
  .planos-section > .container { position: relative; z-index: 1; }
  .planos-head { display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 32px; margin-bottom: 56px; }

  /* Cycle toggle (Mensal / Anual) */
  .plans-toggle {
    display: inline-flex; padding: 4px; gap: 2px;
    background: white; border: 1px solid var(--line); border-radius: 100px;
  }
  .plans-toggle-btn {
    padding: 9px 22px; border: none; background: transparent; cursor: pointer;
    font-family: var(--sans); font-size: 13.5px; font-weight: 500; color: var(--charcoal-2);
    border-radius: 100px; transition: background 0.18s, color 0.18s; white-space: nowrap;
    display: inline-flex; align-items: center; gap: 6px;
  }
  .plans-toggle-btn:hover { color: var(--slate); }
  .plans-toggle-btn.is-active {
    background: var(--slate); color: white; font-weight: 600;
    box-shadow: 0 2px 6px rgba(48,69,91,0.18);
  }
  .plans-toggle-tag {
    font-family: var(--mono); font-size: 10px; font-weight: 500;
    color: var(--turquoise); letter-spacing: 0.04em;
  }
  .plans-toggle-btn.is-active .plans-toggle-tag { color: #9ef0e6; }

  /* Plans grid */
  .planos-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
  .planos-grid.is-monthly [data-cycle="annual"],
  .planos-grid.is-annual [data-cycle="monthly"] { display: none; }

  .plano-card {
    background: white; border: 1px solid rgba(0,197,180,0.18); border-radius: 14px;
    padding: 30px 26px; position: relative;
    box-shadow: 0 8px 24px rgba(0,197,180,0.05), 0 1px 3px rgba(0,197,180,0.03);
    display: flex; flex-direction: column;
    transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s;
  }
  .plano-card:hover { border-color: var(--turquoise); transform: translateY(-2px); }
  .plano-card--featured {
    border: 1.5px solid var(--turquoise);
    box-shadow: 0 10px 28px rgba(0,197,180,0.14), 0 0 0 5px var(--turquoise-soft);
  }
  .best-tag {
    position: absolute; top: -11px; left: 50%; transform: translateX(-50%);
    background: var(--turquoise); color: #0e2030;
    font-family: var(--mono); font-size: 10px; font-weight: 600; letter-spacing: 0.06em;
    text-transform: uppercase; padding: 4px 14px; border-radius: 100px;
    white-space: nowrap;
  }

  .plan-name {
    font-family: var(--sans); font-size: 22px; font-weight: 600;
    letter-spacing: -0.02em; color: var(--slate);
    margin-bottom: 10px; line-height: 1.1;
  }
  .plan-desc {
    font-size: 13.5px; color: var(--charcoal-2); line-height: 1.5;
    margin-bottom: 22px; min-height: 84px;
  }

  .plan-price-block { margin-bottom: 6px; }
  .price-label {
    display: inline-block;
    font-family: var(--mono); font-size: 10.5px; font-weight: 500;
    letter-spacing: 0.06em; text-transform: uppercase;
    color: var(--charcoal-2);
    padding: 3px 9px; border-radius: 100px;
    background: var(--offwhite); margin-bottom: 10px;
  }
  .price-label--discount { color: var(--turquoise); background: var(--turquoise-soft); }
  .price-row { display: flex; align-items: baseline; gap: 3px; }
  .price-cur { font-size: 14px; font-weight: 500; color: var(--charcoal-2); }
  .price-val {
    font-family: var(--sans); font-size: 36px; font-weight: 600;
    color: var(--slate); letter-spacing: -0.025em;
  }
  .price-val-consult {
    font-family: var(--sans); font-size: 26px; font-weight: 600;
    color: var(--slate); letter-spacing: -0.02em;
  }
  .price-period { font-size: 13px; color: var(--charcoal-2); }
  .price-sub { font-size: 12.5px; color: var(--charcoal-3); margin-top: 4px; font-family: var(--mono); }
  .price-plus-row {
    display: flex; align-items: baseline; gap: 3px;
    padding-top: 10px; margin-top: 10px;
    border-top: 1px dashed var(--line);
  }
  .price-plus-sign {
    font-family: var(--sans); font-weight: 600;
    color: var(--turquoise); font-size: 16px;
    margin-right: 4px;
  }
  .price-val-sec {
    font-family: var(--sans); font-size: 22px; font-weight: 600;
    color: var(--slate); letter-spacing: -0.02em;
  }

  .plan-sep { height: 1px; background: var(--line); margin: 18px 0 18px; }
  .plan-items { list-style: none; display: flex; flex-direction: column; gap: 10px; margin-bottom: 26px; padding: 0; }
  .plan-item {
    display: flex; align-items: flex-start; gap: 10px;
    font-size: 13px; color: var(--charcoal-2); line-height: 1.5;
  }
  .check-ico {
    width: 16px; height: 16px; border-radius: 50%;
    background: var(--turquoise-soft);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; margin-top: 2px;
  }
  .plan-cta {
    margin-top: auto;
    display: inline-flex; align-items: center; justify-content: center;
    padding: 11px 18px; font-size: 14px; font-weight: 500;
    border-radius: 8px; transition: all 0.15s;
    line-height: 1; text-decoration: none;
  }
  .plan-cta.cta-outline {
    border: 1px solid var(--line-strong); color: var(--charcoal); background: transparent;
  }
  .plan-cta.cta-outline:hover { border-color: var(--slate); background: var(--slate); color: white; }
  .plan-cta.cta-solid { background: var(--turquoise); color: #0e2030; border: 1px solid var(--turquoise); font-weight: 600; }
  .plan-cta.cta-solid:hover { background: #1ddccb; border-color: #1ddccb; }

  .pricing-link { display: inline-flex; align-items: center; gap: 8px; margin-top: 36px; font-size: 14px; color: var(--slate); font-weight: 500; text-decoration: none; }
  .pricing-link:hover { color: var(--turquoise); }

  @media (max-width: 1024px) {
    .planos-grid { grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 600px) {
    .planos-grid { grid-template-columns: 1fr; }
    .plan-desc { min-height: auto; }
  }
</style>

<script>
  function initPricingToggle() {
    const section = document.querySelector('.planos-section');
    if (!section) return;

    const grid = section.querySelector('.planos-grid') as HTMLElement;
    const btnMonthly = section.querySelector('.plans-toggle-btn[data-cycle="monthly"]') as HTMLButtonElement;
    const btnAnnual = section.querySelector('.plans-toggle-btn[data-cycle="annual"]') as HTMLButtonElement;

    if (!grid || !btnMonthly || !btnAnnual) return;

    function setCycle(cycle: 'monthly' | 'annual') {
      const isMonthly = cycle === 'monthly';

      grid.classList.toggle('is-monthly', isMonthly);
      grid.classList.toggle('is-annual', !isMonthly);

      btnMonthly.classList.toggle('is-active', isMonthly);
      btnAnnual.classList.toggle('is-active', !isMonthly);

      btnMonthly.setAttribute('aria-selected', String(isMonthly));
      btnAnnual.setAttribute('aria-selected', String(!isMonthly));
    }

    btnMonthly.addEventListener('click', () => setCycle('monthly'));
    btnAnnual.addEventListener('click', () => setCycle('annual'));
  }

  document.addEventListener('astro:page-load', initPricingToggle);
  initPricingToggle();
</script>
`;
fs.writeFileSync('/Users/michelspinelli/dev/sites/Site-Voe/src/components/ui/PricingPlans.astro', code);

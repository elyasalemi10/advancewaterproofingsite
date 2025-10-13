import { useEffect } from 'react'
import { setSEO } from '@/lib/seo'

export default function Shortcuts() {
  useEffect(() => {
    setSEO({
      title: 'The Hidden Cost of Shortcuts | Advance Waterproofing',
      description: 'Why your choice of waterproofing applicator is a multi-million dollar decision for your asset\'s lifecycle.',
    })

    // Load Chart.js
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js'
    script.async = true
    script.onload = () => {
      initializeCharts()
    }
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  const initializeCharts = () => {
    // @ts-ignore
    if (typeof Chart === 'undefined') return

    const wrapLabel = (label: string) => {
      const maxLength = 16
      if (label.length <= maxLength) return label

      const words = label.split(' ')
      const lines: string[] = []
      let currentLine = ''

      words.forEach(word => {
        if ((currentLine + ' ' + word).trim().length > maxLength) {
          lines.push(currentLine.trim())
          currentLine = word
        } else {
          currentLine = (currentLine + ' ' + word).trim()
        }
      })
      if (currentLine) {
        lines.push(currentLine.trim())
      }
      return lines
    }

    const tooltipTitleCallback = (tooltipItems: any[]) => {
      const item = tooltipItems[0]
      let label = item.chart.data.labels[item.dataIndex]
      if (Array.isArray(label)) {
        return label.join(' ')
      }
      return label
    }

    // Cost Breakdown Chart
    const costBreakdownCtx = (document.getElementById('costBreakdownChart') as HTMLCanvasElement)?.getContext('2d')
    if (costBreakdownCtx) {
      // @ts-ignore
      new Chart(costBreakdownCtx, {
        type: 'doughnut',
        data: {
          labels: ['Initial Waterproofing Cost', 'Potential Cost From Defects'],
          datasets: [{
            label: 'Cost Contribution',
            data: [2, 80],
            backgroundColor: ['#00A1E4', '#005082'],
            borderColor: '#F2F2F2',
            borderWidth: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                color: '#333333',
                font: { size: 14 }
              }
            },
            tooltip: {
              callbacks: {
                title: tooltipTitleCallback,
                label: function (context: any) {
                  let label = context.label || ''
                  if (label) {
                    label += ': '
                  }
                  if (context.parsed !== null) {
                    label += context.parsed + '% of Total Building Issues'
                  }
                  return label
                }
              }
            },
            title: {
              display: true,
              text: 'Cost vs. Consequence',
              font: { size: 18, weight: 'bold' },
              color: '#333333',
              padding: { bottom: 20 }
            }
          },
          cutout: '60%'
        }
      })
    }

    // Rectification Cost Chart
    const rectificationCostCtx = (document.getElementById('rectificationCostChart') as HTMLCanvasElement)?.getContext('2d')
    if (rectificationCostCtx) {
      const originalLabelsRect = ['Do It Right (Avg. per m²)', 'Minor Leak Rectification', 'Leaking Shower Rectification', 'Balcony Failure Rectification']
      const wrappedLabelsRect = originalLabelsRect.map(wrapLabel)

      // @ts-ignore
      new Chart(rectificationCostCtx, {
        type: 'bar',
        data: {
          labels: wrappedLabelsRect,
          datasets: [{
            label: 'Estimated Cost (AUD)',
            data: [65, 5000, 9500, 25000],
            backgroundColor: ['#00A1E4', '#0077C0', '#005082', '#C00000'],
            borderColor: '#FFFFFF',
            borderWidth: 2,
            borderRadius: 5
          }]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              beginAtZero: true,
              ticks: {
                callback: function (value: any) {
                  return '$' + value.toLocaleString()
                },
                color: '#333333'
              },
              grid: { color: '#E0E0E0' }
            },
            y: {
              ticks: { color: '#333333' },
              grid: { display: false }
            }
          },
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                title: tooltipTitleCallback,
                label: function (context: any) {
                  let label = context.dataset.label || ''
                  if (label) {
                    label += ': '
                  }
                  if (context.parsed.x !== null) {
                    label += '$' + context.parsed.x.toLocaleString()
                  }
                  return label
                }
              }
            }
          }
        }
      })
    }
  }

  return (
    <div className="bg-[#F2F2F2] text-gray-800 min-h-screen">
      <style>{`
        .chart-container {
          position: relative;
          width: 100%;
          max-width: 500px;
          margin-left: auto;
          margin-right: auto;
          height: 300px;
          max-height: 400px;
        }
        @media (min-width: 768px) {
          .chart-container {
            height: 350px;
          }
        }
        .flowchart-node {
          background-color: white;
          border: 2px solid #00A1E4;
          color: #333333;
          padding: 1rem;
          border-radius: 0.5rem;
          text-align: center;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
          transition: transform 0.3s ease;
        }
        .flowchart-node:hover {
          transform: translateY(-5px);
        }
        .flowchart-arrow {
          display: flex;
          align-items: center;
          justify-content: center;
          color: #0077C0;
          font-weight: bold;
          font-size: 2rem;
          margin: 0.5rem 0;
        }
        .stat-card {
          background-color: #005082;
          color: #F2F2F2;
          padding: 2rem;
          border-radius: 0.75rem;
          text-align: center;
          box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
        }
        .stat-number {
          font-size: 4rem;
          font-weight: 900;
          line-height: 1;
          color: #00A1E4;
        }
        .feature-card {
          background-color: white;
          border-left: 5px solid #00A1E4;
        }
      `}</style>

      <div className="container mx-auto p-4 md:p-8 max-w-7xl">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-black text-[#005082] mb-4">The Hidden Cost of a Shortcut</h1>
          <p className="text-lg md:text-xl text-[#333333] max-w-4xl mx-auto">
            Why your choice of waterproofing applicator is a multi-million dollar decision for your asset's lifecycle.
          </p>
        </header>

        <main>
          <section className="mb-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-[#005082] mb-4">The Budgeting Blind Spot</h2>
                <p className="mb-4">
                  Waterproofing typically represents a tiny fraction of a project's total construction budget. However, when it fails, the financial fallout is catastrophic, causing a disproportionate amount of building defects. This initial saving on a cheaper, less experienced applicator quickly becomes one of the most expensive mistakes you can make.
                </p>
                <p className="font-semibold text-[#0077C0]">
                  Choosing the wrong applicator isn't a saving; it's a high-risk gamble with your entire investment.
                </p>
              </div>
              <div>
                <div className="chart-container">
                  <canvas id="costBreakdownChart"></canvas>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-[#005082] text-center mb-8">The Domino Effect of Poor Workmanship</h2>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-start">
              <div className="flowchart-node">
                <div className="text-xl font-bold mb-2">1. The Wrong Choice</div>
                <p>Selecting an inexperienced or unqualified applicator, often to cut initial costs.</p>
              </div>
              <div className="flowchart-arrow">→</div>
              <div className="flowchart-node">
                <div className="text-xl font-bold mb-2">2. Application Failure</div>
                <p>Leads to poor surface prep, wrong material choice, or incorrect membrane thickness.</p>
              </div>
              <div className="flowchart-arrow">→</div>
              <div className="flowchart-node">
                <div className="text-xl font-bold mb-2">3. Water Ingress</div>
                <p>The compromised barrier allows moisture to penetrate the building structure.</p>
              </div>
            </div>
            <div className="flex justify-center my-4">
              <div className="flowchart-arrow text-4xl transform -rotate-90 md:rotate-90">↓</div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flowchart-node bg-[#00A1E4] text-white border-0">
                <div className="text-xl font-bold mb-2">Structural Damage</div>
                <p>Corrosion of steel, concrete cancer, and wood rot compromise building integrity.</p>
              </div>
              <div className="flowchart-node bg-[#00A1E4] text-white border-0">
                <div className="text-xl font-bold mb-2">Asset Devaluation</div>
                <p>Visible damage and a history of leaks significantly reduce property market value.</p>
              </div>
              <div className="flowchart-node bg-[#00A1E4] text-white border-0">
                <div className="text-xl font-bold mb-2">Health Hazards</div>
                <p>Damp environments lead to mould and mildew growth, causing respiratory issues.</p>
              </div>
              <div className="flowchart-node bg-[#00A1E4] text-white border-0">
                <div className="text-xl font-bold mb-2">Extreme Rectification Costs</div>
                <p>Expenses skyrocket due to demolition, repairs, and business interruption.</p>
              </div>
            </div>
          </section>

          <section className="mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              <div className="lg:col-span-1">
                <div className="stat-card">
                  <div className="stat-number">90%</div>
                  <p className="text-xl font-semibold mt-2">
                    of waterproofing failures are attributed to poor workmanship and incorrect application, not material defects.
                  </p>
                </div>
              </div>
              <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-[#005082] mb-4">The Exponential Cost of Rectification</h2>
                <p className="mb-4">
                  Fixing a failed waterproofing system isn't a simple patch job. It often requires stripping back finishes like tiles and flooring, demolishing structures, repairing the underlying damage, and then rebuilding—all before the waterproofing can even be reapplied correctly. The cost of 'doing it twice' is never just double.
                </p>
                <div className="chart-container h-[350px] md:h-96 max-h-[450px]">
                  <canvas id="rectificationCostChart"></canvas>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-[#005082] text-center mb-8">The Anatomy of a Master Applicator</h2>
            <p className="text-center text-lg text-[#333333] max-w-3xl mx-auto mb-10">
              Investing in expertise is an insurance policy against failure. A qualified applicator brings more than just tools to the job; they bring critical knowledge that protects your asset for its entire lifespan.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="feature-card rounded-lg shadow-md p-6">
                <div className="text-4xl mb-4">📚</div>
                <h3 className="text-xl font-bold text-[#005082] mb-2">Certified & Trained</h3>
                <p>Holds formal qualifications and manufacturer certifications, ensuring adherence to industry best practices and warranty requirements.</p>
              </div>
              <div className="feature-card rounded-lg shadow-md p-6">
                <div className="text-4xl mb-4">🔥</div>
                <h3 className="text-xl font-bold text-[#005082] mb-2">Deep Material Knowledge</h3>
                <p>Understands the complex science of how different membranes react with various substrates, climates, and structural movements.</p>
              </div>
              <div className="feature-card rounded-lg shadow-md p-6">
                <div className="text-4xl mb-4">🦺</div>
                <h3 className="text-xl font-bold text-[#005082] mb-2">Meticulous Preparation</h3>
                <p>Recognizes that a successful application depends entirely on flawless surface preparation—the most common point of failure.</p>
              </div>
              <div className="feature-card rounded-lg shadow-md p-6">
                <div className="text-4xl mb-4">⭐</div>
                <h3 className="text-xl font-bold text-[#005082] mb-2">Proven Experience</h3>
                <p>Has a verifiable track record of successful projects and can anticipate and mitigate potential weak points in a building's design.</p>
              </div>
            </div>
          </section>
        </main>

        <footer className="text-center mt-16 pt-8 border-t border-gray-300">
          <h3 className="text-3xl font-black text-[#005082]">Don't Gamble With Your Asset.</h3>
          <p className="text-lg text-[#333333] mt-2">Invest in expertise. Protect your future.</p>
        </footer>
      </div>
    </div>
  )
}


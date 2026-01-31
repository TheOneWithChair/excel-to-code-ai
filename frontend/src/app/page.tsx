import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="container mx-auto px-6 py-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded"></div>
          <span className="text-xl font-semibold">AutoPilot</span>
        </div>
        <nav className="hidden md:flex space-x-8 text-sm">
          <a href="#features" className="text-gray-600 hover:text-gray-900">Features</a>
          <a href="#pricing" className="text-gray-600 hover:text-gray-900">Pricing</a>
          <a href="#about" className="text-gray-600 hover:text-gray-900">About</a>
          <a href="#contact" className="text-gray-600 hover:text-gray-900">Contact</a>
        </nav>
        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
          Get Started
        </button>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-16 text-center">
        <div className="relative mb-8">
          <h1 className="text-6xl md:text-8xl font-black mb-2 leading-none tracking-tight text-gray-900">
            EXCEL TO CODE
          </h1>
          <h1 className="text-6xl md:text-8xl font-black leading-none tracking-tight text-blue-600">
            ON AUTOPILOT
          </h1>
        </div>

        <p className="text-gray-700 text-lg md:text-xl mb-8 max-w-2xl mx-auto font-medium">
          Generate full-stack applications from Excel templates. Define your schema, APIs, and tech stack—get production-ready code instantly.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <button className="bg-gray-100 text-gray-700 px-8 py-3 rounded-lg text-base font-medium hover:bg-gray-200 border border-gray-300">
            View Templates
          </button>
          <Link href="/dashboard">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg text-base font-medium hover:bg-blue-700">
              Start Generating
            </button>
          </Link>
        </div>

        {/* Tech Stack Badges */}
        <div className="max-w-3xl mx-auto">
          <p className="text-gray-500 text-sm mb-4">
            Supports popular tech stacks
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <span className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium border border-gray-200">React + Node.js</span>
            <span className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium border border-gray-200">Next.js + FastAPI</span>
            <span className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium border border-gray-200">Vue + Express</span>
            <span className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium border border-gray-200">Django + PostgreSQL</span>
          </div>
        </div>
      </section>

      {/* Spreadsheet Preview Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">How It Works</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">Define your project structure in Excel and let the AI generate your entire codebase</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden max-w-6xl mx-auto">
          {/* Mock Excel Window Header */}
          <div className="bg-gray-100 px-4 py-2 flex items-center gap-2 border-b border-gray-200">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>
            <span className="text-sm text-gray-600 font-mono ml-2">project-schema.xlsx</span>
          </div>

          {/* Excel Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Entity</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Fields</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Type</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Validation</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Relations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">User</td>
                  <td className="px-6 py-4 text-sm text-gray-900">email</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex px-2 py-1 text-xs font-mono font-medium rounded-md bg-purple-100 text-purple-700">
                      String
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">Email, Required</td>
                  <td className="px-6 py-4 text-sm text-gray-500">-</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">User</td>
                  <td className="px-6 py-4 text-sm text-gray-900">password</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex px-2 py-1 text-xs font-mono font-medium rounded-md bg-purple-100 text-purple-700">
                      String
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">Min 8 chars</td>
                  <td className="px-6 py-4 text-sm text-gray-500">-</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">Project</td>
                  <td className="px-6 py-4 text-sm text-gray-900">name</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex px-2 py-1 text-xs font-mono font-medium rounded-md bg-purple-100 text-purple-700">
                      String
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">Required</td>
                  <td className="px-6 py-4 text-sm text-gray-500">-</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">Project</td>
                  <td className="px-6 py-4 text-sm text-gray-900">owner_id</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex px-2 py-1 text-xs font-mono font-medium rounded-md bg-green-100 text-green-700">
                      Foreign Key
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">Required</td>
                  <td className="px-6 py-4 text-sm text-gray-900">User.id</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Footer with AI message */}
          <div className="bg-blue-50 border-t border-blue-200 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="shrink-0">
                <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-900">
                  AI generates complete project structure, models, APIs, and migrations
                </p>
              </div>
              <div className="shrink-0">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blue AI Assistant Section */}
      <section className="bg-blue-600 text-white py-20 my-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            From Spreadsheet to Production<br />
            in Minutes, Not Months
          </h2>
          <p className="text-lg opacity-90 max-w-3xl mx-auto mb-12">
            No more manual boilerplate. No more copy-pasting project templates. Define your requirements in Excel,
            and get a fully structured, production-ready codebase with best practices baked in.
          </p>
          <div className="flex flex-wrap gap-6 justify-center items-center mt-12">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-sm font-medium">Database Schema</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-sm font-medium">REST APIs</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-sm font-medium">Frontend Components</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-sm font-medium">Authentication</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Excel Templates</h3>
            <p className="text-gray-600 text-sm">Use predefined templates to define your project structure, schema, and APIs</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Code Generation</h3>
            <p className="text-gray-600 text-sm">AI-powered generation of complete full-stack applications with best practices</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Download & Deploy</h3>
            <p className="text-gray-600 text-sm">Get your complete project as a ZIP file, ready to deploy</p>
          </div>
        </div>

        <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center">
          Perfect for Developers,<br />
          Product Managers &<br />
          Engineering Teams
        </h2>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div className="bg-gray-50 rounded-2xl p-8 h-80 flex items-center justify-center">
            <div className="text-center">
              <svg className="w-32 h-32 text-blue-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-600 font-medium">Upload Excel Template</p>
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-semibold mb-4">Accelerate Project Bootstrapping</h3>
            <p className="text-gray-600 mb-6">
              Skip weeks of manual setup and boilerplate code. Define your requirements in structured Excel templates
              and let the AI generate your entire project architecture, database models, API endpoints, and frontend scaffolding.
            </p>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Database schema with relationships
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                RESTful API endpoints with validation
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Frontend components and routing
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Tech Stack Support Section */}
      <section className="container mx-auto px-6 py-16">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-6">
          Multiple Tech Stacks,<br />
          One Simple Workflow
        </h2>
        <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
          Choose your preferred technology stack and get a project configured with industry best practices
        </p>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold mb-2">React + Node.js + PostgreSQL</h3>
                <p className="text-sm text-gray-600">Full-stack JavaScript with modern tooling</p>
              </div>
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">Popular</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded text-xs font-medium">TypeScript</span>
              <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded text-xs font-medium">Express</span>
              <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded text-xs font-medium">Prisma ORM</span>
              <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded text-xs font-medium">JWT Auth</span>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold mb-2">Next.js + FastAPI + MongoDB</h3>
                <p className="text-sm text-gray-600">Modern full-stack with Python backend</p>
              </div>
              <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold">Trending</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded text-xs font-medium">React</span>
              <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded text-xs font-medium">Python 3.11</span>
              <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded text-xs font-medium">Pydantic</span>
              <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded text-xs font-medium">OAuth2</span>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold mb-2">Vue + Django + PostgreSQL</h3>
                <p className="text-sm text-gray-600">Powerful Python framework with reactive frontend</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="bg-green-50 text-green-700 px-3 py-1 rounded text-xs font-medium">Vue 3</span>
              <span className="bg-green-50 text-green-700 px-3 py-1 rounded text-xs font-medium">Django REST</span>
              <span className="bg-green-50 text-green-700 px-3 py-1 rounded text-xs font-medium">Django ORM</span>
              <span className="bg-green-50 text-green-700 px-3 py-1 rounded text-xs font-medium">Token Auth</span>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold mb-2">Angular + .NET Core + SQL Server</h3>
                <p className="text-sm text-gray-600">Enterprise-grade stack for large applications</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="bg-red-50 text-red-700 px-3 py-1 rounded text-xs font-medium">Angular 17</span>
              <span className="bg-red-50 text-red-700 px-3 py-1 rounded text-xs font-medium">.NET 8</span>
              <span className="bg-red-50 text-red-700 px-3 py-1 rounded text-xs font-medium">Entity Framework</span>
              <span className="bg-red-50 text-red-700 px-3 py-1 rounded text-xs font-medium">Identity</span>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="container mx-auto px-6 py-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-center">
          Simple 4-Step<br />
          Generation Process
        </h2>
        <p className="text-gray-600 text-lg mb-12 max-w-2xl mx-auto text-center">
          From Excel to production-ready code in minutes. Our streamlined workflow makes it easy.
        </p>

        <div className="grid md:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 relative">
            <div className="absolute -top-4 left-6 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">1</div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg mb-4 mt-4 flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Upload Templates</h3>
            <p className="text-gray-600 text-sm">Upload Excel files with your schema, APIs, and requirements</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 relative">
            <div className="absolute -top-4 left-6 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">2</div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg mb-4 mt-4 flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Select Tech Stack</h3>
            <p className="text-gray-600 text-sm">Choose your preferred technologies and frameworks</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 relative">
            <div className="absolute -top-4 left-6 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">3</div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg mb-4 mt-4 flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Generate Code</h3>
            <p className="text-gray-600 text-sm">AI generates complete project with best practices</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 relative">
            <div className="absolute -top-4 left-6 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">4</div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg mb-4 mt-4 flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Download & Deploy</h3>
            <p className="text-gray-600 text-sm">Get ZIP file with complete project ready to run</p>
          </div>
        </div>
      </section>

      {/* Everything Section */}
      <section className="bg-gray-50 py-20 my-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-5xl md:text-7xl font-bold mb-12 text-gray-900 leading-tight">
            EVERYTHING<br />
            YOU NEED TO BUILD<br />
            YOUR <span className="text-blue-600">APPLICATION</span><br />
            ON AUTOPILOT
          </h2>
          <div className="flex justify-center items-center gap-8 mb-12">
            <svg className="w-24 h-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <svg className="w-16 h-16 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
            </svg>
            <svg className="w-24 h-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
        </div>
      </section>

      {/* Features List Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-12">
          <div>
            <h3 className="text-2xl font-bold mb-6">Backend Generation</h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                REST API Endpoints
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Database Models & Migrations
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Authentication & Authorization
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Input Validation & Error Handling
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-6">Frontend Generation</h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Component Architecture
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Routing & Navigation
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                State Management
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Responsive Design
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-6">DevOps & Configuration</h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Docker Configuration
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Environment Variables
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                README & Documentation
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Git Repository Setup
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-white py-20 my-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to accelerate your development?
          </h2>
          <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
            Join developers and teams already using Excel to Code AI to bootstrap their projects faster
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg text-base font-medium hover:bg-blue-700">
              Start Generating Code
            </button>
            <button className="bg-gray-100 text-gray-700 px-8 py-3 rounded-lg text-base font-medium hover:bg-gray-200 border border-gray-300">
              Download Sample Templates
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm opacity-90">
                <li><a href="#" className="hover:underline">Features</a></li>
                <li><a href="#" className="hover:underline">Pricing</a></li>
                <li><a href="#" className="hover:underline">Security</a></li>
                <li><a href="#" className="hover:underline">Roadmap</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm opacity-90">
                <li><a href="#" className="hover:underline">About</a></li>
                <li><a href="#" className="hover:underline">Blog</a></li>
                <li><a href="#" className="hover:underline">Careers</a></li>
                <li><a href="#" className="hover:underline">Press</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm opacity-90">
                <li><a href="#" className="hover:underline">Documentation</a></li>
                <li><a href="#" className="hover:underline">Help Center</a></li>
                <li><a href="#" className="hover:underline">Community</a></li>
                <li><a href="#" className="hover:underline">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm opacity-90">
                <li><a href="#" className="hover:underline">Privacy</a></li>
                <li><a href="#" className="hover:underline">Terms</a></li>
                <li><a href="#" className="hover:underline">Cookie Policy</a></li>
                <li><a href="#" className="hover:underline">Licenses</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-blue-500 pt-8 text-center text-sm opacity-90">
            <p>&copy; 2026 AutoPilot. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

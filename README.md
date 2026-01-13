# ProDict: Dictionary for Programming Terminologies

A personal, dictionary built with ASP.NET Core Minimal APIs to store programming terminologies, descriptions, and reference links.

This Project was built to solve the problem "I forgot the term for this" a problem while practicing and learning software development.

> [!Note]
> This Project is built for personal use because I often forget some programming terminologies when learning. if you want to add or change something to the application you can fork my repo.

## 🚀 Tech Stack

- **Backend** - ASP.NET Core 10 Minimal APIs
- **Database** - SQLite (Development) / PostgreSQL (Production/Locally)
- **Architecture** - Traditional N-Layer
- **Frontend** - React (Soon)
- **Containerization** - Docker (Soon)

## 🏗 Architecture

This Application will going to use the Traditional N-Layer but refactoring it
to _Vertical Slice Architecture (VSA)_ or _Clean Architecture_ later since i'm
still learning it.

## ✨ Keyfeatures

- **CRUD** Create, Read, Update, Delete Terminologies
- **Reference Linking** You can attach links from (official documentation, W3Schools, Mdn, etc...)
- **Categorization** Group terms by technology (C#, ASP.NET, React, TypeScript, etc...)
- **Global Search** Find definitions quickly by using keyword search

## 🛠️ Getting Started

### Prerequisites

- .NET 10 SDK
- Docker (Optional, for PostgreSQL)

### Installation

1. Clone the repository:

```bash
git clone <github link>
```

2. Navigate to the server directory:

```bash
cd src/App.Server
```

3. Run the application:

```bash
dotnet run
```

4. Test the server

---

MIT [LICENSE](LICENSE)

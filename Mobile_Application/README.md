# 🚀 Space Hunters – NASA Space Biology Knowledge Engine

**Space Hunters** is a modern mobile application built for the **NASA Space Apps Challenge 2025**, addressing the challenge: **“Build a Space Biology Knowledge Engine.”**
The app empowers users to explore, understand, and analyze NASA bioscience research by combining:

* **AI-powered summarization**
* **Interactive search & filtering**
* **Data visualizations**
* **Smart chat with AI**

Our goal is to make the 600+ NASA bioscience publications more **accessible, explorable, and actionable** for scientists, mission planners, and the public.

---

## 🌍 Overview

With **Space Hunters**, users can:

* 🔍 **Search & filter** NASA bioscience publications by topic, keyword, or category.
* 📄 **Read AI-generated summaries** (Background, Results, Conclusion) for each study.
* 🤖 **Interact with AI chat** to ask custom questions about any publication.
* 📊 **Visualize data & trends** with charts (distribution, categories, time-series).
* ⭐ **Save favorites** and track reading progress.
* 🌐 **Access external NASA resources** (OSDR, Task Book, and publication links).

The app is built with **Flutter** and integrates **Gemini AI** for summarization and conversational Q&A, using the official dataset of publications:
🔗 [NASA Space Biology Publications Dataset (GitHub)](https://github.com/jgalazka/SB_publications/tree/main)

---

## ✨ Key Features

* **Multi-section AI Summaries:** Each publication shows *Background, Results, and Conclusions* in a clean, structured format.
* **Interactive AI Chat:** Ask questions about a paper → get context-aware answers instantly.
* **Smart Search & Filters:** Find papers by biological system, research focus, or keyword.
* **Visual Insights:** Distribution graphs, category breakdowns, and time trends.
* **Favorites & Progress:** Save publications and revisit them later.
* **NASA Resource Integration:** Direct links to OSDR datasets and Task Book project pages.

---

## 📸 Screenshots

<table>
  <tr>
    <td align="center">
      <img src="https://github.com/MGehad/Space_Hunters/blob/main/Mobile_Application/screenshots/home.png" width="250"/><br/>
      <b>Home</b>
    </td>
    <td align="center">
      <img src="https://github.com/MGehad/Space_Hunters/blob/main/Mobile_Application/screenshots/publication_all.png" width="250"/><br/>
      <b>All Publications</b>
    </td>
    <td align="center">
      <img src="https://github.com/MGehad/Space_Hunters/blob/main/Mobile_Application/screenshots/publication_cat.png" width="250"/><br/>
      <b>Publications by Category</b>
    </td>
  </tr>
  <tr>
    <td align="center">
      <img src="https://github.com/MGehad/Space_Hunters/blob/main/Mobile_Application/screenshots/publication_details.png" width="250"/><br/>
      <b>Publication Details</b>
    </td>
    <td align="center">
      <img src="https://github.com/MGehad/Space_Hunters/blob/main/Mobile_Application/screenshots/publication_details_2.png" width="250"/><br/>
      <b>Details</b>
    </td>
    <td align="center">
      <img src="https://github.com/MGehad/Space_Hunters/blob/main/Mobile_Application/screenshots/publication_details_3.png" width="250"/><br/>
      <b>Details</b>
    </td>
  </tr>
  <tr>
    <td align="center">
      <img src="https://github.com/MGehad/Space_Hunters/blob/main/Mobile_Application/screenshots/publication_details_4.png" width="250"/><br/>
      <b>Details</b>
    </td>
    <td align="center">
      <img src="https://github.com/MGehad/Space_Hunters/blob/main/Mobile_Application/screenshots/favorites.png" width="250"/><br/>
      <b>Favorites</b>
    </td>
    <td align="center">
      <img src="https://github.com/MGehad/Space_Hunters/blob/main/Mobile_Application/screenshots/favorites_empty.png" width="250"/><br/>
      <b>Favorites (Empty)</b>
    </td>
  </tr>
  <tr>
    <td align="center" colspan="3">
      <img src="https://github.com/MGehad/Space_Hunters/blob/main/Mobile_Application/screenshots/chat.png" width="250"/><br/>
      <b>AI Chat</b>
    </td>
  </tr>
</table>

---

## 🌐 Live Demo

Try Space Hunters directly in your browser (no installation needed):

* [Demo Link 1](https://appetize.io/app/b_irjfqddzwqp4o4vzl2skhad4va)
* [Demo Link 2](https://appetize.io/app/b_vcshm5adskrcqpm35jqkb3zwsi)

---

## 🛠️ Getting Started

### Requirements

* Flutter SDK (latest stable)
* Dart SDK
* Android Studio / Xcode / any Flutter-supported IDE
* Internet connection

### Installation

Clone the repository:

```bash
git clone https://github.com/MGehad/Space_Hunters.git
cd Space_Hunters/Mobile_Application
```

Install dependencies:

```bash
flutter pub get
```

Run the app locally:

```bash
flutter run
```

---

## 📂 Project Structure

* `lib/` → App source code (UI, logic, AI helpers)
* `assets/` → Images, icons, configuration files
* `pubspec.yaml` → Dependencies and assets definition
* `screenshots/` → App screenshots

---

## ⚙️ How It Works

1. On the **Home screen**, search or browse publications.
2. Open a **Publication Details screen** → view AI summary (Background, Results, Conclusion).
3. Click **Ask AI** → start an interactive Q&A about the study.
4. Explore **charts** for trends and insights.
5. Save favorites for quick access later.

---

## 💻 Technologies Used

* **Flutter** – Cross-platform UI framework
* **Gemini AI** – Summarization and chatbot
* **NASA Open Data** – Metadata & bioscience publications
* **Provider & http** – State management & API calls
* **Appetize.io** – Live mobile demo hosting

---

## 🙏 Acknowledgments

* NASA Biological and Physical Sciences Division
* NASA Space Biology Publications contributors
* Gemini AI & Google Cloud
* NASA Space Apps Challenge Community

---

## 📜 License

This project is developed for **educational and hackathon purposes** under the NASA Space Apps Challenge 2025 guidelines.

---

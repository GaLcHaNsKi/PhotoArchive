export const locales = ["en", "ru"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const isLocale = (value: string | undefined | null): value is Locale => {
  return value === "en" || value === "ru";
};

export const dictionaries = {
  en: {
    header: {
      albums: "Albums",
      articles: "Articles",
      admin: "Admin",
      languageLabel: "Language",
      languageEnglish: "English",
      languageRussian: "Russian"
    },
    home: {
      eyebrow: "Public archive",
      title: "Organizational memory, preserved as albums and editorial stories.",
      copy: "Browse public collections, discover event history, and keep internal administration focused on secure uploads and structured metadata.",
      panelCopy: "Built for self-hosted deployments with filesystem storage, PostgreSQL metadata and pre-generated previews.",
      openArchive: "Open archive",
      featuredAlbums: "Featured albums",
      allAlbums: "All albums",
      categories: "Categories",
      browseCatalog: "Browse catalog",
      recentStories: "Recent stories",
      allArticles: "All articles"
    },
    albumCard: {
      fallback: "Archive",
      publicArchive: "Public archive",
      descriptionFallback: "Curated event archive with gallery preview.",
      noYear: "No year",
      photosSuffix: "photos"
    },
    articleCard: {
      fallback: "Story",
      editorialStory: "Editorial story",
      summaryFallback: "Story, context, and linked archive imagery."
    },
    albums: {
      eyebrow: "Archive catalog",
      title: "Albums",
      back: "Back to albums",
      archiveFallback: "Archive",
      noDescription: "No description yet.",
      gallery: "Gallery",
      imagesSuffix: "images"
    },
    articles: {
      eyebrow: "Editorial module",
      title: "Articles",
      description: "Public editorial stories live alongside albums and can reuse the same photo assets. Open a story to read the article body and browse its linked images.",
      back: "Back to articles",
      editorialStory: "Editorial story",
      summaryFallback: "Editorial context for the archive and linked imagery.",
      linkedPhotos: "Linked photos",
      imagesSuffix: "images"
    },
    auth: {
      adminAccess: "Admin access",
      signInTitle: "Sign in to manage the archive",
      signInCopy: "Upload photos, create albums, assign categories and prepare editorial materials from the same backend.",
      username: "Username",
      password: "Password",
      signIn: "Sign in",
      signingIn: "Signing in...",
      loginFailed: "Login failed. Check credentials and backend availability."
    },
    admin: {
      workspace: "Admin workspace",
      controlRoom: "Archive control room",
      signedInAs: "Signed in as",
      withRole: "with role",
      toolsHint: "Use the focused tools below to create categories and publish articles.",
      accountsTitle: "Admin accounts",
      accountsCopy: "Create new admin users and delegate archive management access.",
      categoriesTitle: "Categories",
      categoriesCopy: "Create archive taxonomies and keep album navigation structured.",
      articlesTitle: "Articles",
      articlesCopy: "Write editorial stories, sanitize HTML, and attach existing archive photos.",
      signOut: "Sign out",
      signingOut: "Signing out...",
      logoutFailed: "Logout failed."
    },
    adminCategories: {
      eyebrow: "Taxonomy",
      title: "Categories",
      description: "New categories appear immediately in the public archive and become available for album organization.",
      currentCategories: "Current categories",
      albumsSuffix: "albums",
      name: "Name",
      slug: "Slug",
      namePlaceholder: "Exhibitions",
      slugPlaceholder: "exhibitions",
      create: "Create category",
      saving: "Saving...",
      created: "Category created.",
      failed: "Category creation failed."
    },
    adminArticles: {
      eyebrow: "Editorial",
      title: "Articles",
      description: "Publish public stories or keep drafts private. Link existing photos from selected albums.",
      latestPublic: "Latest public articles",
      fieldTitle: "Title",
      fieldSlug: "Slug",
      fieldSummary: "Summary",
      fieldContentHtml: "Content HTML",
      fieldVisibility: "Visibility",
      visibilityPrivate: "Private draft",
      visibilityPublic: "Public",
      fieldAlbum: "Album",
      noAlbum: "No album",
      fieldCoverPhoto: "Cover photo",
      noCover: "No cover",
      fieldTags: "Tags",
      fieldLinkedPhotos: "Linked photos",
      pickAlbumHint: "Pick an album to load its photos.",
      titlePlaceholder: "Annual archive review",
      slugPlaceholder: "annual-archive-review",
      summaryPlaceholder: "Short editorial summary",
      contentPlaceholder: "<p>Story body</p>",
      tagsPlaceholder: "history, events, 2026",
      saving: "Saving...",
      submit: "Publish article draft",
      created: "Article created.",
      failed: "Article creation failed.",
      loadAlbumsFailed: "Unable to load albums",
      loadPhotosFailed: "Unable to load photos for album",
      private: "private",
      public: "public"
    },
    adminUsers: {
      eyebrow: "Root tools",
      title: "Create admin accounts",
      description: "Accounts are active immediately and can sign in through the admin login page.",
      username: "Username",
      password: "Password",
      usernamePlaceholder: "archive-admin",
      passwordPlaceholder: "StrongPass123",
      creating: "Creating...",
      create: "Create admin account",
      created: "Admin account created.",
      failed: "Admin creation failed."
    }
  },
  ru: {
    header: {
      albums: "Альбомы",
      articles: "Статьи",
      admin: "Админ",
      languageLabel: "Язык",
      languageEnglish: "English",
      languageRussian: "Русский"
    },
    home: {
      eyebrow: "Публичный архив",
      title: "Память организации в альбомах и редакционных историях.",
      copy: "Просматривайте публичные коллекции, изучайте историю событий и управляйте загрузками и метаданными из админ-панели.",
      panelCopy: "Система для self-hosted развёртывания: файловое хранилище, PostgreSQL и заранее сгенерированные превью.",
      openArchive: "Открыть архив",
      featuredAlbums: "Избранные альбомы",
      allAlbums: "Все альбомы",
      categories: "Категории",
      browseCatalog: "Смотреть каталог",
      recentStories: "Свежие истории",
      allArticles: "Все статьи"
    },
    albumCard: {
      fallback: "Архив",
      publicArchive: "Публичный архив",
      descriptionFallback: "Кураторский архив события с предпросмотром галереи.",
      noYear: "Без года",
      photosSuffix: "фото"
    },
    articleCard: {
      fallback: "История",
      editorialStory: "Редакционная история",
      summaryFallback: "История, контекст и связанные архивные изображения."
    },
    albums: {
      eyebrow: "Каталог архива",
      title: "Альбомы",
      back: "Назад к альбомам",
      archiveFallback: "Архив",
      noDescription: "Описание пока не добавлено.",
      gallery: "Галерея",
      imagesSuffix: "изображений"
    },
    articles: {
      eyebrow: "Редакционный модуль",
      title: "Статьи",
      description: "Публичные редакционные истории живут рядом с альбомами и используют те же фото-ассеты. Откройте статью, чтобы прочитать текст и просмотреть связанные изображения.",
      back: "Назад к статьям",
      editorialStory: "Редакционная история",
      summaryFallback: "Редакционный контекст для архива и связанных изображений.",
      linkedPhotos: "Связанные фото",
      imagesSuffix: "изображений"
    },
    auth: {
      adminAccess: "Доступ администратора",
      signInTitle: "Вход в управление архивом",
      signInCopy: "Загружайте фото, создавайте альбомы, назначайте категории и готовьте редакционные материалы из одного backend.",
      username: "Логин",
      password: "Пароль",
      signIn: "Войти",
      signingIn: "Вход...",
      loginFailed: "Не удалось войти. Проверьте учётные данные и доступность backend."
    },
    admin: {
      workspace: "Рабочее пространство админа",
      controlRoom: "Панель управления архивом",
      signedInAs: "Вы вошли как",
      withRole: "с ролью",
      toolsHint: "Используйте инструменты ниже для создания категорий и публикации статей.",
      accountsTitle: "Аккаунты админов",
      accountsCopy: "Создавайте новых администраторов и делегируйте доступ к управлению архивом.",
      categoriesTitle: "Категории",
      categoriesCopy: "Создавайте таксономию архива и поддерживайте структуру навигации.",
      articlesTitle: "Статьи",
      articlesCopy: "Пишите редакционные истории, санитизируйте HTML и прикрепляйте архивные фото.",
      signOut: "Выйти",
      signingOut: "Выход...",
      logoutFailed: "Не удалось выйти."
    },
    adminCategories: {
      eyebrow: "Таксономия",
      title: "Категории",
      description: "Новые категории сразу появляются в публичном архиве и становятся доступны для организации альбомов.",
      currentCategories: "Текущие категории",
      albumsSuffix: "альбомов",
      name: "Название",
      slug: "Слаг",
      namePlaceholder: "Выставки",
      slugPlaceholder: "vystavki",
      create: "Создать категорию",
      saving: "Сохранение...",
      created: "Категория создана.",
      failed: "Не удалось создать категорию."
    },
    adminArticles: {
      eyebrow: "Редакция",
      title: "Статьи",
      description: "Публикуйте истории или храните черновики приватными. Привязывайте фото из выбранных альбомов.",
      latestPublic: "Последние публичные статьи",
      fieldTitle: "Заголовок",
      fieldSlug: "Слаг",
      fieldSummary: "Краткое описание",
      fieldContentHtml: "HTML содержимое",
      fieldVisibility: "Видимость",
      visibilityPrivate: "Приватный черновик",
      visibilityPublic: "Публичная",
      fieldAlbum: "Альбом",
      noAlbum: "Без альбома",
      fieldCoverPhoto: "Обложка",
      noCover: "Без обложки",
      fieldTags: "Теги",
      fieldLinkedPhotos: "Связанные фото",
      pickAlbumHint: "Выберите альбом, чтобы загрузить его фото.",
      titlePlaceholder: "Годовой обзор архива",
      slugPlaceholder: "godovoy-obzor-arhiva",
      summaryPlaceholder: "Короткое редакционное описание",
      contentPlaceholder: "<p>Текст статьи</p>",
      tagsPlaceholder: "история, события, 2026",
      saving: "Сохранение...",
      submit: "Опубликовать черновик",
      created: "Статья создана.",
      failed: "Не удалось создать статью.",
      loadAlbumsFailed: "Не удалось загрузить альбомы",
      loadPhotosFailed: "Не удалось загрузить фото альбома",
      private: "приватный",
      public: "публичный"
    },
    adminUsers: {
      eyebrow: "Инструменты root",
      title: "Создание админ-аккаунтов",
      description: "Аккаунты активны сразу и могут входить через страницу админ-логина.",
      username: "Логин",
      password: "Пароль",
      usernamePlaceholder: "archive-admin",
      passwordPlaceholder: "StrongPass123",
      creating: "Создание...",
      create: "Создать админ-аккаунт",
      created: "Админ-аккаунт создан.",
      failed: "Не удалось создать админ-аккаунт."
    }
  }
} as const;

export const getDictionary = (locale: Locale) => dictionaries[locale];

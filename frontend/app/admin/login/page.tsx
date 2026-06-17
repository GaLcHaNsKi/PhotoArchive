import { LoginForm } from "@components/login-form";
import { getI18n } from "@modules/i18n/server";

export default async function AdminLoginPage() {
  const { dictionary } = await getI18n();

  return (
    <main className="page-content">
      <section className="login-panel-wrap">
        <div className="login-panel">
          <p className="eyebrow">{dictionary.auth.adminAccess}</p>
          <h1>{dictionary.auth.signInTitle}</h1>
          <p>{dictionary.auth.signInCopy}</p>
          <LoginForm labels={dictionary.auth} />
        </div>
      </section>
    </main>
  );
}

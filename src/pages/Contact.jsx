import { useState } from "react";


export default function Contact() {

  const [values, setValues] = useState({ name: "", email: "", phone: "", message: "" });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);
  const onChange = (e) => {

    setValues(v => ({ ...v, [e.target.name]: e.target.value }));
    setErrors(err => ({ ...err, [e.target.name]: "" }));
    setSent(false);
  };
  const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  const validate = () => {
    const e = {};

    if (!values.name.trim()) e.name = "El nombre es obligatorio.";

    if (!values.email.trim()) {
      e.email = "El email es obligatorio.";
    } else if (!isEmail(values.email.trim())) {
      e.email = "Formato de email no válido.";
    }
    if (!isPhone(values.phone.trim())) {
      e.phone = "El teléfono debe tener 7 a 15 dígitos (opcional).";
    }
    if (!values.message.trim()) e.message = "El mensaje es obligatorio.";

    return e;
  };
  const onSubmit = (e) => {
    e.preventDefault();
    const eobj = validate();
    setErrors(eobj);
    if (Object.keys(eobj).length) return;
    setSent(true);
    setValues({ name: "", email: "", phone: "", message: "" });
  };

  return (
    <section className="container my-5" style={{ maxWidth: 560 }}>
      <h1>Contacto</h1>
      <form onSubmit={onSubmit} noValidate>
        <div className="mb-3">
          <label className="form-label">Nombre</label>
          <input
            className="form-control"
            name="name"
            value={values.name}
            onChange={onChange}
          />
          {errors.name && <div className="text-danger">{errors.name}</div>}
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            className="form-control"
            type="email"
            name="email"
            value={values.email}
            onChange={onChange}
          />
          {errors.email && <div className="text-danger">{errors.email}</div>}
        </div>
        <div className="mb-3">
          <label className="form-label">Teléfono (opcional)</label>
          <input
            className="form-control"
            type="tel"
            name="phone"
            value={values.phone}
            onChange={onChange}
            placeholder="+56912345678"
          />
          {errors.phone && <div className="text-danger">{errors.phone}</div>}
        </div>
        <div className="mb-3">
          <label className="form-label">Mensaje</label>
          <textarea
            className="form-control"
            rows="4"
            name="message"
            value={values.message}
            onChange={onChange}
          />
          {errors.message && <div className="text-danger">{errors.message}</div>}
        </div>
        <button className="btn btn-primary" type="submit">Enviar</button>
        {sent && <div className="text-success mt-2">¡Formulario enviado correctamente!</div>}
      </form>
    </section>
  );
}
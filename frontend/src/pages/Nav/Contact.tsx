import { useForm, ValidationError } from "@formspree/react";
import "../../styles/Contact.scss";

const Contact: React.FC = () => {
  const [state, handleSubmit] = useForm(import.meta.env.VITE_FORMSPREE_ID); //almaceno en .env

  if (state.succeeded) {
    //enviado con exito,  propiedad dentro del estado (state) que devuelve el hook useForm de Formspree
    return (
      <div className="contact-msg-sent">
        <p>Thank you for your inquiry. We will get back to you soon!</p>;
      </div>)
  }

  return (
    // documentación de Formspree -Sección: Build your form: https://help.formspree.io/hc/en-us/articles/360053108134-Build-a-Contact-Form-with-React
    <div className="contact-form-wrapper">
      <div className="contact-form-container">
        <h1>Contact</h1>
        <form onSubmit={handleSubmit} className="contact-form">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" name="email" required />
          <ValidationError prefix="Email" field="email" errors={state.errors} />
          <label htmlFor="message">Message</label>
          <textarea id="message" name="message" required />
          <ValidationError
            prefix="Message"
            field="message"
            errors={state.errors}
          />
          <button type="submit" disabled={state.submitting}>
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;

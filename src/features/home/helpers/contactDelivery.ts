/**
 * The delivery abstraction (architecture section 2.1). `ContactForm` imports
 * only from this module, never from a specific delivery implementation, so
 * the implementation is replaceable without redesigning the form. Today it
 * re-exports the Netlify Forms implementation.
 */
export type { ContactDeliveryResult } from './contactDelivery.netlify';
export { submitContact } from './contactDelivery.netlify';

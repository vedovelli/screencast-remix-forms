import type { ActionFunction } from "@remix-run/node";
import { z } from "zod";
import { makeDomainFunction } from "remix-domains";
import { formAction, Form } from "remix-forms";

const schema = z.object({
  email: z.string().email({ message: "Fornecer email valido" }),
  password: z.string().min(4, { message: "Senha muito curta." }),
  password2: z.string().min(4, { message: "Senha muito curta." }),
});

const mutation = makeDomainFunction(
  schema.refine((data) => data.password === data.password2, {
    message: "As senhas informadas não são iguais",
    path: ["password2"],
  })
)(async (values) => {
  console.log(values);

  return values;
});

export const action: ActionFunction = async ({ request }) =>
  formAction({
    request,
    schema,
    mutation,
    successPath: "/account",
  });

export default () => (
  <Form schema={schema}>
    {({ Field, Errors, Button, register }) => (
      <>
        <Field name="email" label="E-mail">
          {({ Label, Errors }) => (
            <>
              <Label className="text-red-600" />
              <input {...register("email")} type="email" autoComplete="off" />
              <Errors className="text-green-800" />
            </>
          )}
        </Field>
        <Field name="password" label="Senha">
          {({ Label, Errors }) => (
            <>
              <Label />
              <input {...register("password")} type="password" />
              <Errors />
            </>
          )}
        </Field>
        <Field name="password2" label="Repetir Senha">
          {({ Label, Errors }) => (
            <>
              <Label />
              <input {...register("password2")} type="password" />
              <Errors />
            </>
          )}
        </Field>
        <Errors />
        <Button type="submit" />
      </>
    )}
  </Form>
);

import React from "react";
import {Button, Form} from "semantic-ui-react";
import {toast} from "react-toastify";
import {useFormik} from "formik";
import * as Yup from "yup";
import {useMutation} from "@apollo/client";
import {UPDATE_USER} from "../../../gql/user";
import "./EmailForm.scss";

export default function EmailForm(props) {
    const {setShowModal, currentEmail, refetch} = props;
    const [updateUser] = useMutation(UPDATE_USER);

    const formik = useFormik({
        initialValues: {
            email: currentEmail || ""
        },
        validationSchema: Yup.object({
            email: Yup.string().email().required()
        }),
        onSubmit: async (formValues) => {
            try {
                const result = await updateUser({
                    variables: {
                        input: formValues
                    }
                });
                if (!result.data.updateUser) {
                    toast.error("Error al actualizar el correo electrónico");
                } else {
                    refetch();
                    setShowModal(false);
                }
            } catch (error) {
                console.log('Error updating user email - ', error);
                toast.error("Error al actualizar el correo electrónico");
            }
        }
    });

    return (
        <Form className="email-form" onSubmit={formik.handleSubmit}>
            <Form.Input placeholder="Nuevo correo electrónico"
                        name="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        error={formik.errors.email && true}
            />
            <Button type="submit" className="btn-submit">Actualizar</Button>
        </Form>
    );
}

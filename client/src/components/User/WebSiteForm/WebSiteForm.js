import React from "react";
import {Button, Form} from "semantic-ui-react";
import {useFormik} from "formik";
import {UPDATE_USER} from "../../../gql/user";
import {toast} from "react-toastify";
import {useMutation} from "@apollo/client";
import * as Yup from "yup";
import "./WebSiteForm.scss";

export default function WebSiteForm(props) {
    const {setShowModal, refetch, currentWebsite} = props;
    const [updateUser] = useMutation(UPDATE_USER);

    const formik = useFormik({
        initialValues: {
            website: currentWebsite || ""
        },
        validationSchema: Yup.object({
            website: Yup.string().required()
        }),
        onSubmit: async (formValues) => {
            try {
                const result = await updateUser({
                    variables: {
                        input: formValues
                    }
                });
                if (!result.data.updateUser) {
                    toast.error("Error actualizando el sitio web");
                } else {
                    refetch();
                    setShowModal(false);
                }
            } catch (error) {
                console.log('Error updating user website - ', error);
                toast("Error actualizando el sitio web");
            }
        }
    });

    return (
        <Form className="web-site-form" onSubmit={formik.handleSubmit}>
            <Form.Input placeholder="Dirección url de tu sitio web"
                        name="website"
                        value={formik.values.website}
                        onChange={formik.handleChange}
                        error={formik.errors.website && true}
            />
            <Button type="submit" className="btn-submit">Actualizar</Button>
        </Form>
    );
}

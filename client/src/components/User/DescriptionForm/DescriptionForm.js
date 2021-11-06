import React from "react";
import {Button, Form, TextArea} from "semantic-ui-react";
import {toast} from "react-toastify";
import {useFormik} from "formik";
import * as Yup from "yup";
import {useMutation} from "@apollo/client";
import {UPDATE_USER} from "../../../gql/user";
import "./DescriptionForm.scss";

export default function DescriptionForm(props) {
    const {setShowModal, currentDescription, refetch} = props;
    const [updateUser] = useMutation(UPDATE_USER);

    const formik = useFormik({
        initialValues: {description: currentDescription || ""},
        validationSchema: Yup.object({
            description: Yup.string().required()
        }),
        onSubmit: async (formValues) => {
            try {
                const result = await updateUser({
                    variables: {
                        input: formValues
                    }
                });
                if (!result.data.updateUser) {
                    toast.error("Error al actualizar tu biografía");
                } else {
                    refetch();
                    setShowModal(false);
                }
            } catch (error) {
                toast.error("Error al actualizar tu biografía");
                console.log("Error updating user description - ", error);
            }
        }
    });

    return (
        <Form className="description-form" onSubmit={formik.handleSubmit}>
            <TextArea name="description"
                      value={formik.values.description}
                      onChange={formik.handleChange}
                      className={formik.errors.description && "error"}
            />
            <Button type="submit" className="btn-submit">Actualizar</Button>
        </Form>
    );
}

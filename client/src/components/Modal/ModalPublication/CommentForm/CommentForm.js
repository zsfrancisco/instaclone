import React from "react";
import {Button, Form} from "semantic-ui-react";
import {useFormik} from "formik";
import * as Yup from "yup";
import {useMutation} from "@apollo/client";
import {ADD_COMMENT} from "../../../../gql/comment";
import "./CommentForm.scss";

export default function CommentForm(props) {
    const {publication} = props;
    const [addComment] = useMutation(ADD_COMMENT);

    const formik = useFormik({
        initialValues: {
            comment: ""
        },
        validationSchema: Yup.object({
            comment: Yup.string().required()
        }),
        onSubmit: async (formValues) => {
            try {
                await addComment({
                    variables: {
                        input: {
                            idPublication: publication.id,
                            comment: formValues.comment
                        }
                    }
                });
                formik.resetForm();
            } catch (error) {
                console.log('Error publication comment - ', error);
            }
        }
    });

    return (
        <Form className="comment-form" onSubmit={formik.handleSubmit}>
            <Form.Input placeholder="Añade un comentario"
                        name="comment"
                        value={formik.values.comment}
                        onChange={formik.handleChange}
                        error={formik.errors.comment && true}
            />
            <Button type="submit">Publicar</Button>
        </Form>
    );
}

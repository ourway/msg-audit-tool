package com.amos2020.javabackend.rest_service;

import com.amos2020.javabackend.entity.Answer;
import com.amos2020.javabackend.entity.Question;
import com.amos2020.javabackend.rest_service.controller.AnswerController;
import com.amos2020.javabackend.rest_service.request.answer.CreateAnswerRequest;
import com.amos2020.javabackend.rest_service.request.answer.UpdateAnswerRequest;
import com.amos2020.javabackend.rest_service.response.BasicAnswerResponse;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import javassist.NotFoundException;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import java.util.ArrayList;

import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@WebMvcTest(AnswerRestService.class)
public class AnswerRestServiceTest {

    @Autowired
    MockMvc restService;

    @MockBean
    private AnswerController answerController;

    @Test
    public void getAnswerByIds_returnsOk() throws Exception {
        Answer answer = new Answer();
        answer.setInterviewId(1);
        answer.setQuestionId(1);
        answer.setQuestionByQuestionId(new Question());
        given(answerController.getAnswerByIds(1, 1)).willReturn(new BasicAnswerResponse(answer));

        restService.perform(get("/answers/interview/1/question/1")).andExpect(status().isOk());
    }

    @Test
    public void getAnswersByInterviewId_returnOK() throws Exception {
        given(answerController.getAllAnswersByInterviewId(1)).willReturn(new ArrayList<>());

        restService.perform(get("/answers/interview/1")).andExpect(status().isOk());
    }

    @Test
    public void createAnswerByValidRequest_returnOK() throws Exception {
        CreateAnswerRequest request = new CreateAnswerRequest();
        request.setInterviewId(1);
        request.setQuestionId(1);
        Answer answer = new Answer();
        answer.setQuestionByQuestionId(new Question());
        given(answerController.createAnswer(request.getQuestionId(), request.getInterviewId())).willReturn(new BasicAnswerResponse(answer));

        String requestAsJson = buildJson(request);
        restService.perform(post("/answers")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestAsJson))
                .andExpect(status().isOk());
    }

    @Test
    public void createAnswerByInvalidQuestionId_return400() throws Exception {
        CreateAnswerRequest request = new CreateAnswerRequest();
        request.setInterviewId(1);
        Answer answer = new Answer();
        answer.setQuestionByQuestionId(new Question());
        given(answerController.createAnswer(request.getQuestionId(), request.getInterviewId())).willReturn(new BasicAnswerResponse(answer));

        String requestAsJson = buildJson(request);
        restService.perform(post("/answers")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestAsJson))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void createAnswerByInvalidInterviewId_return400() throws Exception {
        CreateAnswerRequest request = new CreateAnswerRequest();
        request.setQuestionId(1);
        Answer answer = new Answer();
        answer.setQuestionByQuestionId(new Question());
        given(answerController.createAnswer(request.getQuestionId(), request.getInterviewId())).willReturn(new BasicAnswerResponse(answer));
        String requestAsJson = buildJson(request);

        restService.perform(post("/answers")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestAsJson))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void createAnswerByInterviewIdNotFound_return404() throws Exception {
        CreateAnswerRequest request = new CreateAnswerRequest();
        request.setQuestionId(1);
        request.setInterviewId(1);
        given(answerController.createAnswer(request.getQuestionId(), request.getInterviewId())).willThrow(NotFoundException.class);
        String requestAsJson = buildJson(request);

        restService.perform(post("/answers")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestAsJson))
                .andExpect(status().isNotFound());
    }

    @Test
    public void updateAnswerByValidRequest_returnOk() throws Exception {
        UpdateAnswerRequest request = new UpdateAnswerRequest();
        request.setInterviewId(1);
        request.setQuestionId(1);
        request.setAnnotation("test");
        request.setProof("test");
        request.setReason("test");
        Answer answer = new Answer();
        answer.setQuestionByQuestionId(new Question());

        given(answerController.updateAnswer(request.getInterviewId(), request.getQuestionId(),
                request.getResult(), request.getResponsible(),
                request.getDocumentation(), request.getProcedure(), request.getReason(),
                request.getProof(), request.getAnnotation())).willReturn(new BasicAnswerResponse(answer));
        String requestAsJson = buildJson(request);

        restService.perform(put("/answers/interview/1/question/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestAsJson))
                .andExpect(status().isOk());
    }

    @Test
    public void updateAnswerByInvalidRequest_return400() throws Exception {
        UpdateAnswerRequest request = new UpdateAnswerRequest();
        request.setInterviewId(1);
        request.setQuestionId(1);
        request.setAnnotation("test");
        request.setProof("test");
        request.setReason("test");
        given(answerController.updateAnswer(request.getInterviewId(), request.getQuestionId(),
                request.getResult(), request.getResponsible(),
                request.getDocumentation(), request.getProcedure(), request.getReason(),
                request.getProof(), request.getAnnotation())).willThrow(new IllegalArgumentException());
        String requestAsJson = buildJson(request);

        restService.perform(put("/answers/interview/1/question/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestAsJson))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void updateAnswerByInterviewNotFound_return404() throws Exception {
        UpdateAnswerRequest request = new UpdateAnswerRequest();
        request.setInterviewId(1);
        request.setQuestionId(1);
        request.setAnnotation("test");
        request.setProof("test");
        request.setReason("test");
        given(answerController.updateAnswer(request.getInterviewId(), request.getQuestionId(),
                request.getResult(), request.getResponsible(),
                request.getDocumentation(), request.getProcedure(), request.getReason(),
                request.getProof(), request.getAnnotation())).willThrow(new NotFoundException(""));
        String requestAsJson = buildJson(request);

        restService.perform(put("/answers/interview/1/question/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestAsJson))
                .andExpect(status().isNotFound());
    }

    private String buildJson(Object object) throws JsonProcessingException {
        ObjectMapper mapper = new ObjectMapper();
        mapper.configure(SerializationFeature.WRAP_ROOT_VALUE, false);
        return mapper.writer().withDefaultPrettyPrinter().writeValueAsString(object);
    }
}

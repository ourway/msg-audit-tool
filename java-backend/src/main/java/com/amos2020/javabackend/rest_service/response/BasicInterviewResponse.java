package com.amos2020.javabackend.rest_service.response;

import com.amos2020.javabackend.entity.Answer;
import com.amos2020.javabackend.entity.ContactPerson;
import com.amos2020.javabackend.entity.Interview;
import com.amos2020.javabackend.entity.InterviewStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

import java.sql.Date;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

public class BasicInterviewResponse {

    @Getter
    @Setter
    @Schema(type = "Integer", name = "id", example = "654321")
    private int id;
    @Getter
    @Setter
    @Schema(type = "Integer", name = "auditId", example = "123456")
    private int auditId;
    @Getter
    @Setter
    @Schema(type = "string", name = "startDate", format = "date")
    private Date startDate;
    @Getter
    @Setter
    @Schema(type = "string", name = "endDate", format = "date")
    private Date endDate;
    @Getter
    @Setter
    @Schema(type = "string", name = "note", example = "Some notes...")
    private String note;
    @Getter
    @Setter
    @Schema(type = "string", name = "status", example = "ACTIVE")
    private InterviewStatus status;
    @Getter
    @Setter
    @Schema(type = "array", name = "answers", example = "[\n" +
            "    {\n" +
            "      \"questionId\": 1,\n" +
            "      \"interviewId\": 3,\n" +
            "      \"faccritId\": 1,\n" +
            "      \"result\": false,\n" +
            "      \"responsible\": false,\n" +
            "      \"documentation\": false,\n" +
            "      \"procedure\": false,\n" +
            "      \"reason\": \"reason\",\n" +
            "      \"proof\": \"proof\",\n" +
            "      \"annotation\": \"annotation\"\n" +
            "    }]")
    private Collection<Answer> answers;
    @Getter
    @Setter
    @Schema(type = "array", name = "interviewedContactPersons", example = "[{\n" +
            "    \"id\": 1,\n" +
            "    \"salutation\": \"MANN\",\n" +
            "    \"title\": \"Prof\",\n" +
            "    \"forename\": \"Max\",\n" +
            "    \"surname\": \"Mustermann\",\n" +
            "    \"contactInformation\": \"max.mustermann@gmx.de, tel: 0123456789\",\n" +
            "    \"companyName\": \"msg systems AG\",\n" +
            "    \"department\": \"Softwareentwicklung\",\n" +
            "    \"sector\": \"msg Public Sector\",\n" +
            "    \"corporateDivision\": \"Software\"\n" +
            "  }]")
    private List<ContactPerson> interviewedContactPersons;

    public BasicInterviewResponse(Interview interview, List<ContactPerson> interviewedContactPersons) {
        this.id = interview.getId();
        this.auditId = interview.getAuditId();
        this.startDate = interview.getStartDate();
        this.endDate = interview.getEndDate();
        this.status = interview.getStatus();
        this.note = interview.getNote();
        this.answers = new ArrayList<>();
        if (interview.getAnswersById() != null) {
            this.answers = interview.getAnswersById();
        }
        this.interviewedContactPersons = interviewedContactPersons;
    }
}

import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Interview } from 'src/app/core/data/models/interview.model';
import { FacCrit } from 'src/app/core/data/models/faccrit.model';
import { Select, Store } from '@ngxs/store';
import { AuditState } from 'src/app/core/ngxs/audit.state';

@Component({
  selector: 'app-interview',
  templateUrl: './interview.component.html',
  styleUrls: ['./interview.component.scss'],
})
export class InterviewComponent implements OnInit {
  interview$: Observable<Interview>;
  facCrit$: Observable<FacCrit>;

  @Select(AuditState.facCrits) facCrits$: Observable<FacCrit[]>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private store: Store,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      const facCritId = params.get('facCritId');
      const interviewId = params.get('interviewId');

      if (!facCritId || !interviewId) {
        this.router.navigate(['/audits']);
      }

      this.facCrit$ = this.store.select(AuditState.facCrit(facCritId));
      this.interview$ = this.store.select(AuditState.interview(interviewId));

      this.facCrit$.subscribe(facCrit => facCrit ?? this.router.navigate(['/audits']));
      this.facCrit$.subscribe(facCrit => {
        this.formGroups = [];
        for (const question of facCrit.questions) {
          this.store
            .select(AnswerState.answer(this.facCritId, this.interviewId, question.id))
            .subscribe(answer => {
              this.formGroups.push(
                this.fb.group({
                  result: [answer?.result],
                  responsible: [answer?.responsible],
                  documentation: [answer?.documentation],
                  procedure: [answer?.procedure],
                  reason: [answer?.reason],
                  proof: [answer?.proof],
                  annotation: [answer?.annotation],
                }),
              );
            });
        }
      });
    });
  }

  onSave() {
    this.facCrit$.subscribe(facCrit => {
      for (const [i, question] of facCrit.questions.entries()) {
        const formGroup = this.formGroups[i];

        const answer: Answer = {
          proof: formGroup.get('proof').value,
          result: formGroup.get('result').value,
          documentation: formGroup.get('documentation').value,
          procedure: formGroup.get('procedure').value,
          reason: formGroup.get('reason').value,
          annotation: formGroup.get('annotation').value,
          responsible: formGroup.get('responsible').value,
          facCritId: this.facCritId,
          interviewId: this.interviewId,
          questionId: question.id,
        };

        this.store;
        const a = this.store.selectSnapshot(
          AnswerState.answer(this.facCritId, this.interviewId, question.id),
        );
        if (!a) {
          this.store.dispatch(new AddAnswer(answer));
        } else {
          this.store.dispatch(new UpdateAnswer(answer));
        }
      }
    });
  }
}

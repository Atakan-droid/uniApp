import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PostDetail } from 'src/app/models/postDetail';
import { PostService } from 'src/app/services/post.service';
@Component({
  selector: 'app-postmain',
  templateUrl: './postmain.component.html',
  styleUrls: ['./postmain.component.css']
})
export class PostmainComponent implements OnInit {

  PostAddForm: FormGroup;
  posts:PostDetail[];
  user:any=localStorage.getItem("userId")
  constructor( private formBuilder: FormBuilder,
    private toastrService: ToastrService,private postService:PostService) { }

  ngOnInit(): void {
    this.createPostAddForm();
    this.getPosts();
  }
  createPostAddForm() {
    this.PostAddForm = this.formBuilder.group({
      uniId: [parseInt(this.user)],
      uniPost: ['', Validators.required],
    });
}
postAdd(){
    if (this. PostAddForm.valid) {
      let post = Object.assign({}, this.PostAddForm.value);
      this.postService.postAdd(post).subscribe(
        response => {
          this.toastrService.success(response.message, 'Başarılı');
          window.location.reload();
        },
        responseError => {
          if (responseError.error.Errors.length > 0) {
            for (let i = 0; i < responseError.error.Errors.length; i++) {
              this.toastrService.error(
                responseError.error.Errors[i].ErrorMessage,
                'Hata'
              );
            }
          }
        }
      );
    } else {
      this.toastrService.error('Formunuz eksik', 'Dikkat');
    }
  
}
getPosts(){
  this.postService.postGetAll().subscribe(response => {
    this.posts = response.data;
  })
}
}
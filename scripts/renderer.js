import * as CG from './transforms.js';
import { Matrix } from "./matrix.js";


class Renderer {
    // canvas:              object ({id: __, width: __, height: __})
    // limit_fps_flag:      bool 
    // fps:                 int
    constructor(canvas, limit_fps_flag, fps) {
        this.canvas = document.getElementById(canvas.id);
        this.canvas.width = canvas.width;
        this.canvas.height = canvas.height;
        this.ctx = this.canvas.getContext('2d');
        this.slide_idx = 0;
        this.limit_fps = limit_fps_flag;
        this.fps = fps;
        this.start_time = null;
        this.prev_time = null;

        this.models = { //defining models in model space
            slide0: [
                // example model (diamond) -> should be replaced with actual model
                {
                    vertices: [
                        CG.Vector3(0, 150, 1), //this is the point, calling Vector3 is turning the point into a matrix
                        CG.Vector3(-150, 0, 1),
                        CG.Vector3(0, -150, 1),
                        CG.Vector3(150, 0, 1),
                        //we just add more edges here to be a circle!
                    ],
                    transform: null,
                    current: [
                            CG.Vector3(0, 150, 1), //this is the point, calling Vector3 is turning the point into a matrix
                            CG.Vector3(-150, 0, 1),
                            CG.Vector3(0, -150, 1),
                            CG.Vector3(150, 0, 1)
                            //we just add more edges here to be a circle!
                        ],
                    t_x: 150,
                    t_y: 150,
                    velocity_x: 200,
                    velocity_y: 100
                }
            ],
            slide1: [
                {
                    origin:  [
                        CG.Vector3(0, 150, 1), //this is the point, calling Vector3 is turning the point into a matrix
                        CG.Vector3(-150, 0, 1),
                        CG.Vector3(0, -150, 1),
                        CG.Vector3(150, 0, 1),
                        //we just add more edges here to be a circle!
                    ],
                },
                {
                    vertices: [
                        CG.Vector3(400, 150, 1),
                        CG.Vector3(500, 300, 1),
                        CG.Vector3(400, 450, 1),
                        CG.Vector3(300, 300, 1)
                    ],
                    transform: null
                },
                {
                    vertices: [
                        CG.Vector3(200, 50, 1),
                        CG.Vector3(300, 200, 1),
                        CG.Vector3(200, 350, 1),
                        CG.Vector3(100, 200, 1)
                    ],
                    transform: null
                },
                {
                    vertices: [
                        CG.Vector3(600, 150, 1),
                        CG.Vector3(700, 300, 1),
                        CG.Vector3(600, 450, 1),
                        CG.Vector3(500, 300, 1)
                    ],
                    transform: null
                }
            ],
            slide2: [                
                {
                    transform: null,
                    origin: [
                        CG.Vector3(0, 150, 1), //this is the point, calling Vector3 is turning the point into a matrix
                        CG.Vector3(-150, 0, 1),
                        CG.Vector3(0, -150, 1),
                        CG.Vector3(150, 0, 1)
                    ],
                    current: [
                        CG.Vector3(0, 150, 1), //this is the point, calling Vector3 is turning the point into a matrix
                        CG.Vector3(-150, 0, 1),
                        CG.Vector3(0, -150, 1),
                        CG.Vector3(150, 0, 1)
                    ],
                    vertices: [
                        CG.Vector3(400, 150, 1),
                        CG.Vector3(500, 300, 1),
                        CG.Vector3(400, 450, 1),
                        CG.Vector3(300, 300, 1)
                    ]
                }
            ],
            slide3: []
        };
    }

    // flag:  bool
    limitFps(flag) {
        this.limit_fps = flag;
    }

    // n:  int
    setFps(n) {
        this.fps = n;
    }

    // idx: int
    setSlideIndex(idx) {
        this.slide_idx = idx;
    }

    animate(timestamp) {
        // Get time and delta time for animation
        if (this.start_time === null) {
            this.start_time = timestamp;
            this.prev_time = timestamp;
        }
        let time = timestamp - this.start_time;
        let delta_time = timestamp - this.prev_time;
        //console.log('animate(): t = ' + time.toFixed(1) + ', dt = ' + delta_time.toFixed(1));

        // Update transforms for animation
        this.updateTransforms(time, delta_time);

        // Draw slide
        this.drawSlide();

        // Invoke call for next frame in animation
        if (this.limit_fps) {
            setTimeout(() => {
                window.requestAnimationFrame((ts) => {
                    this.animate(ts);
                });
            }, Math.floor(1000.0 / this.fps));
        }
        else {
            window.requestAnimationFrame((ts) => {
                this.animate(ts);
            });
        }

        // Update previous time to current one for next calculation of delta time
        this.prev_time = timestamp;
    }

    //
    updateTransforms(time, delta_time) {
        //Slide0 - bouncing ball

        //calculate what the translation will be
        // Matrix M transform = velocity*delta_time + P(old position)

        //if you need to do two things, you can do T(tx, tx)*R(theta) - spinning and moving... etc
        //                                           rotate first, translate second

        //get the velocities
        let velocity_x = this.models.slide0[0].velocity_x;
        let velocity_y = this.models.slide0[0].velocity_y;
        
        //calculate newest t_x and t_y
        let t_x = this.models.slide0[0].t_x + velocity_x * delta_time/1000;
        let t_y = this.models.slide0[0].t_y + velocity_y * delta_time/1000;

        // if t_x is too wide, flip the velocity of the x and set that to negative in the model
        if (t_x > this.canvas.width-140) {
            velocity_x = -1*velocity_x;
            t_x = this.models.slide0[0].t_x + (velocity_x * delta_time/1000);
            this.models.slide0[0].velocity_x = velocity_x;
        } else if (t_x < 140) {
            velocity_x = -1*velocity_x;
            t_x = this.models.slide0[0].t_x + (velocity_x * delta_time/1000);
            this.models.slide0[0].velocity_x = velocity_x;
        } else if (t_y > this.canvas.height-140) {
            velocity_y = -1*velocity_y;
            t_y = this.models.slide0[0].t_y + (velocity_y * delta_time/1000);
            this.models.slide0[0].velocity_y = velocity_y;
        } else if (t_y < 140) {
            velocity_y = -1*velocity_y;
            t_y = this.models.slide0[0].t_y + (velocity_y * delta_time/1000);
            this.models.slide0[0].velocity_y = velocity_y;
        }
        this.models.slide0[0].t_x = t_x;
        this.models.slide0[0].t_y = t_y;
        
        let transform = CG.mat3x3Translate(new Matrix(3,3), t_x, t_y);
        this.models.slide0[0].transform = transform;



        // Slide1 - spinning polygons
        // ------ Polygon 1 ------
        let theta = 10;
        let theta_new = theta * time / 100000;

        let rotation = CG.mat3x3Rotate(new Matrix(3, 3), theta_new);
        let translation_matrix = CG.mat3x3Translate(new Matrix(3, 3), 200, 200);
        let transform_final = Matrix.multiply([translation_matrix, rotation]);
        this.models.slide1[0].transform = transform_final;

        // ------ Polygon 2 ------ (spinning opposite)

        let theta1 = -20; 
        let theta_new1 = theta1 * time / 100000; 

        let rotation1 = CG.mat3x3Rotate(new Matrix(3, 3), theta_new1);
        let translation_matrix1 = CG.mat3x3Translate(new Matrix(3, 3), 400, 400); 
        let transform_final1 = Matrix.multiply([translation_matrix1, rotation1]);
        this.models.slide1[1].transform = transform_final1; 

        // ------ Polygon 3 ------ (different speed)

        let theta2 = 60; 
        let theta_new2 = theta2 * time / 100000; 

        let rotation2 = CG.mat3x3Rotate(new Matrix(3, 3), theta_new2);
        let translation_matrix2 = CG.mat3x3Translate(new Matrix(3, 3), 600, 200); 
        let transform_final2 = Matrix.multiply([translation_matrix2, rotation2]);
        this.models.slide1[2].transform = transform_final2; 

<<<<<<< HEAD
        // Slide2 - Grow/shrink ---old
=======
       
        // Slide2 - Grow/shrink
>>>>>>> 662e82f494eedcac0cfb0d891a918f1740b8f7ee
        let sx = .1;
        let sy= .1;

        // let s_x = sx*delta_time/100;
        // let s_y = sy*delta_time/100;
        
        let s_x = sx*time/1000;
        let s_y = sy*time/1000;
        // console.log(time);

        if (time > 10000) {
            s_x = s_x/(time/1000);
            s_y = s_y/(time/1000);
        }
        // if (time > 10000


        let grow_shrink = CG.mat3x3Scale(new Matrix(3,3), s_x, s_y); 
        let translation_matrix_grow_shrink = CG.mat3x3Translate(new Matrix(3,3), 200, 200); // move the matrix 200 pixels
        let transform_final_grow_shrink = Matrix.multiply([translation_matrix_grow_shrink, grow_shrink]); //grow the matrix, then move it
        this.models.slide2[0].transform = transform_final_grow_shrink
        // console.log(this.models.slide2[0].transform);

        // Slide2 - Grow/shrink ---new

        // let sx = .1;
        // let sy= .1;
        // let s_x = 0;
        // let s_y = 0;

        // if (s_x <= .3 || s_y <= .3) {
        //     s_x = sx*(delta_time/1000); //.1* 1, .1* 2
        //     s_y = sy*(delta_time/1000);
        // }
        
        // // console.log(s_x)
        // if (s_x > .2  || s_y > .2) {
        //     s_x = sx/(delta_time/1000);
        //     s_y = sy/(delta_time/1000);
        // }

        // let grow_shrink = CG.mat3x3Scale(new Matrix(3,3), s_x, s_y);

        // let translation_matrix_grow_shrink = CG.mat3x3Translate(new Matrix(3,3), 200, 200);
        // let transform_final_grow_shrink = Matrix.multiply([translation_matrix_grow_shrink, grow_shrink]);
        // this.models.slide2[0].transform = transform_final_grow_shrink;

    }
    
    //
    drawSlide() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        switch (this.slide_idx) {
            case 0:
                this.drawSlide0();
                break;
            case 1:
                this.drawSlide1();
                break;
            case 2:
                this.drawSlide2();
                break;
            case 3:
                this.drawSlide3();
                break;
        }
    }

    //
    drawSlide0() {
        let teal = [0, 128, 128, 255];
        let vertices = [];
        for (let i=0; i < this.models.slide0[0].current.length; i++) {
            let new_vertex = Matrix.multiply([this.models.slide0[0].transform, this.models.slide0[0].current[i]]);
            vertices.push(new_vertex);
        }
        this.drawConvexPolygon(vertices, teal);
    }

    
    drawSlide1() {
        // TODO: draw at least 3 polygons that spin about their own centers
        //   - have each polygon spin at a different speed / direction

        let teal = [0, 128, 128, 255];
        let red = [255, 0, 0, 255];
        let blue = [0, 0, 255, 255];

        let vertices_one = [];
        for (let i = 0; i < this.models.slide1[0].origin.length; i++) {
            let new_vertex = Matrix.multiply([this.models.slide1[0].transform, this.models.slide1[0].origin[i]]);
            vertices_one.push(new_vertex);
        }
        this.drawConvexPolygon(vertices_one, teal);

        let vertices_two = [];
        for (let i = 0; i < this.models.slide1[1].vertices.length; i++) {
            let new_vertex = Matrix.multiply([this.models.slide1[1].transform, this.models.slide1[0].origin[i]]);
            vertices_two.push(new_vertex);
        }
        this.drawConvexPolygon(vertices_two, red);

        let vertices_three = [];
        for (let i = 0; i < this.models.slide1[2].vertices.length; i++) {
            let new_vertex = Matrix.multiply([this.models.slide1[2].transform, this.models.slide1[0].origin[i]]);
            vertices_three.push(new_vertex);
        }
        this.drawConvexPolygon(vertices_three, blue);

        // let vertices_two = [];
        // for (let i=0; i < this.models.slide1[0].vertices.length; i++) {
            
        // }

        // for (let i=0; i < this.models.slide1[0].vertices.length; i++) {
            
        // }

        // this.drawConvexPolygon(this.models.slide1[1].vertices, teal);
        // this.drawConvexPolygon(this.models.slide1[2].vertices, teal);
        
    }

    //
    drawSlide2() {
        // TODO: draw at least 2 polygons grow and shrink about their own centers
        //   - have each polygon grow / shrink different sizes
        //   - try at least 1 polygon that grows / shrinks non-uniformly in the x and y direction

        //works but doens't stop growing
        let teal = [0, 128, 128, 255];

        let vertices_one = [];
        for (let i=0; i < this.models.slide2[0].origin.length; i++) {
            let new_vertex = Matrix.multiply([this.models.slide2[0].transform, this.models.slide2[0].origin[i]]);
            vertices_one.push(new_vertex);
            console.log(vertices_one);
        }
        this.drawConvexPolygon(vertices_one, teal);


        // let teal = [0, 128, 128, 255];

        // let vertices_one = [];
        // for (let i=0; i < this.models.slide2[1].vertices.length; i++) {
        //     let new_vertex = Matrix.multiply([this.models.slide2[0].transform, this.models.slide2[1].vertices[i]]);
        //     vertices_one.push(new_vertex);
        // }
        // this.models.slide2[1].vertices = vertices_one;
        // this.drawConvexPolygon(vertices_one, teal);

    }

    //
    drawSlide3() {
        // TODO: get creative!
        //   - animation should involve all three basic transformation types
        //     (translation, scaling, and rotation)
        
        
    }
    
    // vertex_list:  array of object [Matrix(3, 1), Matrix(3, 1), ..., Matrix(3, 1)]
    // color:        array of int [R, G, B, A]
    drawConvexPolygon(vertex_list, color) {
        this.ctx.fillStyle = 'rgba(' + color[0] + ',' + color[1] + ',' + color[2] + ',' + (color[3] / 255) + ')';
        this.ctx.beginPath();
        let x = vertex_list[0].values[0][0] / vertex_list[0].values[2][0];
        let y = vertex_list[0].values[1][0] / vertex_list[0].values[2][0];
        this.ctx.moveTo(x, y);
        for (let i = 1; i < vertex_list.length; i++) {
            x = vertex_list[i].values[0][0] / vertex_list[i].values[2][0];
            y = vertex_list[i].values[1][0] / vertex_list[i].values[2][0];
            this.ctx.lineTo(x, y);
        }
        this.ctx.closePath();
        this.ctx.fill();
    }
};


export { Renderer };


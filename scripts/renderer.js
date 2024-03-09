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
                {
                    transform: null,
                    origin: [
                            CG.Vector3(0, 150, 1), 
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
                    s_x: 1,
                    s_y: 1,
                    size_x: .3, //how fast it grows in the x direction
                    size_y: .3,
                    magnitude: 1, // how big it gets
                    origin: [
                        CG.Vector3(0, 150, 1), //this is the point, calling Vector3 is turning the point into a matrix
                        CG.Vector3(-150, 0, 1),
                        CG.Vector3(0, -150, 1),
                        CG.Vector3(150, 0, 1)
                    ],
                },
                {
                    transform: null,
                    s_x: 1,
                    s_y: 1,
                    size_x: .1, //how fast it grows in the x direction
                    size_y: .3,
                    magnitude: 1.2, //how big it gets
                    origin: [
                        CG.Vector3(0, 150, 1), //this is the point, calling Vector3 is turning the point into a matrix
                        CG.Vector3(-150, 0, 1),
                        CG.Vector3(0, -150, 1),
                        CG.Vector3(150, 0, 1)
                    ],
                },
            ],
            slide3: [
                {
                    transform: null,
                    s_x: 1,
                    s_y: 1,
                    size_x: .1, //how fast it grows in the x direction
                    size_y: .3,
                    magnitude: 1.2, //how big it gets
                    origin: [
                        CG.Vector3(0, 150, 1), //this is the point, calling Vector3 is turning the point into a matrix
                        CG.Vector3(-150, 0, 1),
                        CG.Vector3(0, -150, 1),
                        CG.Vector3(150, 0, 1)
                    ],
                },
                {
                    transform: null,
                    s_x: 1,
                    s_y: 1,
                    size_x: .1, //how fast it grows in the x direction
                    size_y: .3,
                    magnitude: 1.2, //how big it gets
                    origin: [
                        CG.Vector3(0, 150, 1), //this is the point, calling Vector3 is turning the point into a matrix
                        CG.Vector3(-150, 0, 1),
                        CG.Vector3(0, -150, 1),
                        CG.Vector3(150, 0, 1)
                    ],
                },
                {
                    transform: null,
                    s_x: 1,
                    s_y: 1,
                    size_x: .1, //how fast it grows in the x direction
                    size_y: .3,
                    magnitude: 1.2, //how big it gets
                    origin: [
                        CG.Vector3(0, 150, 1), //this is the point, calling Vector3 is turning the point into a matrix
                        CG.Vector3(-150, 0, 1),
                        CG.Vector3(0, -150, 1),
                        CG.Vector3(150, 0, 1)
                    ],
                },
                {
                    origin: [
                        CG.Vector3(0, 150, 1), //this is the point, calling Vector3 is turning the point into a matrix
                        CG.Vector3(-150, 0, 1),
                        CG.Vector3(0, -150, 1),
                        CG.Vector3(150, 0, 1),
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
                        CG.Vector3(400, 150, 1),
                        CG.Vector3(500, 300, 1),
                        CG.Vector3(400, 450, 1),
                        CG.Vector3(300, 300, 1)
                    ],
                    transform: null
                },
                {
                    transform: null,
                    origin: [
                            CG.Vector3(0, 150, 1), 
                            CG.Vector3(-150, 0, 1),
                            CG.Vector3(0, -150, 1),
                            CG.Vector3(150, 0, 1)
                        ],
                    t_x: 150,
                    t_y: 150,
                    velocity_x: 200,
                    velocity_y: 100
                }
            ],
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

    updateTransforms(time, delta_time) {
        // -----------------------------------------------------
        //Slide0 - bouncing ball
        // -----------------------------------------------------

        //get the velocities
        let velocity_x = this.models.slide0[0].velocity_x;
        let velocity_y = this.models.slide0[0].velocity_y;
        
        //calculate newest t_x and t_y
        let t_x = this.models.slide0[0].t_x + velocity_x * delta_time/1000;
        let t_y = this.models.slide0[0].t_y + velocity_y * delta_time/1000;

        // if t_x is too wide, flip the velocity of the x and set that to negative in the model
        if (t_x > this.canvas.width-50) {
            velocity_x = -1*velocity_x;
            t_x = this.models.slide0[0].t_x + (velocity_x * delta_time/1000);
            this.models.slide0[0].velocity_x = velocity_x;
        } else if (t_x < 50) {
            velocity_x = -1*velocity_x;
            t_x = this.models.slide0[0].t_x + (velocity_x * delta_time/1000);
            this.models.slide0[0].velocity_x = velocity_x;
        } else if (t_y > this.canvas.height-50) {
            velocity_y = -1*velocity_y;
            t_y = this.models.slide0[0].t_y + (velocity_y * delta_time/1000);
            this.models.slide0[0].velocity_y = velocity_y;
        } else if (t_y < 50) {
            velocity_y = -1*velocity_y;
            t_y = this.models.slide0[0].t_y + (velocity_y * delta_time/1000);
            this.models.slide0[0].velocity_y = velocity_y;
        }
        this.models.slide0[0].t_x = t_x;
        this.models.slide0[0].t_y = t_y;

        let transform = CG.mat3x3Translate(new Matrix(3,3), t_x, t_y);
        this.models.slide0[0].transform = transform;

        // ---------------------------------------
        // Slide1 - spinning polygons
        // -------------------------------------------

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

        // ------------------------------------
        // Slide2 - Grow/Shrink
        // ------------------------------------

        // ------ Polygon 1 - normal growth/shrink -----
        //get size constants
        let size_x = this.models.slide2[0].size_x; //how much it grows in the x direction
        let size_y = this.models.slide2[0].size_y;
        
        //calculate newest s_x and s_y using the old ones
        let s_x = this.models.slide2[0].s_x + size_x * delta_time/1000;
        let s_y = this.models.slide2[0].s_y + size_y * delta_time/1000;
        if (s_x > this.models.slide2[0].magnitude) {
            size_x = -1*size_x; 
            size_y = -1*size_y;
            s_x = this.models.slide2[0].s_x + (size_x * delta_time/1000); //recalculate it with the new size
            s_y = this.models.slide2[0].s_y + (size_y * delta_time/1000);
            this.models.slide2[0].size_x = size_x;
            this.models.slide2[0].size_y = size_y;
        } else if (s_x < 0) {
            size_x = -1*size_x; 
            size_y = -1*size_y;
            s_x = this.models.slide2[0].s_x + (size_x * delta_time/1000); //recalculate it with the new size
            s_y = this.models.slide2[0].s_y + (size_y * delta_time/1000);
            this.models.slide2[0].size_x = size_x;
            this.models.slide2[0].size_y = size_y;
        }
        this.models.slide2[0].s_x = s_x;
        this.models.slide2[0].s_y = s_y;

        let grow_shrink = CG.mat3x3Scale(new Matrix(3,3), s_x, s_y); 
        let translation_matrix_grow_shrink = CG.mat3x3Translate(new Matrix(3,3), 200, 200); // move the matrix 200 pixels
        let transform_final_grow_shrink = Matrix.multiply([translation_matrix_grow_shrink, grow_shrink]); //grow the matrix, then move it
        this.models.slide2[0].transform = transform_final_grow_shrink

        // ----- Polygon 2 - non-uniformly growing at different rate----
        let size_x_2 = this.models.slide2[1].size_x; //how much it grows in the x direction
        let size_y_2 = this.models.slide2[1].size_y;
        console.log(size_x_2);
        console.log(size_y_2);
        
        //calculate newest s_x and s_y using the old ones
        let s_x_2 = this.models.slide2[1].s_x + size_x_2 * delta_time/1000;
        let s_y_2 = this.models.slide2[1].s_y + size_y_2 * delta_time/1000;
        if (s_x_2 > this.models.slide2[1].magnitude) {
            size_x_2 = -1*size_x_2; 
            size_y_2 = -1*size_y_2;
            s_x_2 = this.models.slide2[1].s_x + (size_x_2 * delta_time/1000); //recalculate it with the new size
            s_y_2 = this.models.slide2[1].s_y + (size_y_2 * delta_time/1000);
            this.models.slide2[1].size_x = size_x_2;
            this.models.slide2[1].size_y = size_y_2;
        } else if (s_x_2 < 0) {
            size_x_2 = -1*size_x_2; 
            size_y_2 = -1*size_y_2;
            s_x_2 = this.models.slide2[1].s_x + (size_x_2 * delta_time/1000); //recalculate it with the new size
            s_y_2 = this.models.slide2[1].s_y + (size_y_2 * delta_time/1000);
            this.models.slide2[1].size_x = size_x_2;
            this.models.slide2[1].size_y = size_y_2;
        }
        this.models.slide2[1].s_x = s_x_2;
        this.models.slide2[1].s_y = s_y_2;

        let grow_shrink_2 = CG.mat3x3Scale(new Matrix(3,3), s_x_2, s_y_2); 
        let translation_matrix_grow_shrink_2 = CG.mat3x3Translate(new Matrix(3,3), 600, 300); // move the matrix 200 pixels
        let transform_final_grow_shrink_2 = Matrix.multiply([translation_matrix_grow_shrink_2, grow_shrink_2]); //grow the matrix, then move it
        this.models.slide2[1].transform = transform_final_grow_shrink_2

        // ------------------------------------
        // Slide3 - FUN!
        // ------------------------------------
        // Part 1: Polygons growing
        // ------------------------------------
        let size_x_3 = this.models.slide3[0].size_x; 
        let size_y_3 = this.models.slide3[0].size_y;
        let s_x_3 = this.models.slide3[0].s_x + size_x_3 * delta_time / 1000;
        let s_y_3 = this.models.slide3[0].s_y + size_y_3 * delta_time / 1000;
        if (s_x_3 > this.models.slide3[0].magnitude) {
            size_x_3 = -1 * size_x_3;
            size_y_3 = -1 * size_y_3;
            s_x_3 = this.models.slide3[0].s_x + (size_x_3 * delta_time / 1000); 
            s_y_3 = this.models.slide3[0].s_y + (size_y_3 * delta_time / 1000);
            this.models.slide3[0].size_x = size_x_3;
            this.models.slide3[0].size_y = size_y_3;
        } else if (s_x_3 < 0) {
            size_x_3 = -1 * size_x_3;
            size_y_3 = -1 * size_y_3;
            s_x_3 = this.models.slide3[0].s_x + (size_x_3 * delta_time / 1000); 
            s_y_3 = this.models.slide3[0].s_y + (size_y_3 * delta_time / 1000);
            this.models.slide3[0].size_x = size_x_3;
            this.models.slide3[0].size_y = size_y_3;
        }

        this.models.slide3[0].s_x = s_x_3;
        this.models.slide3[0].s_y = s_y_3;

        let grow_shrink_3 = CG.mat3x3Scale(new Matrix(3, 3), s_x_3, s_y_3);
        let translation_matrix_grow_shrink_3 = CG.mat3x3Translate(new Matrix(3, 3), 600, 300); 
        let transform_final_grow_shrink_3 = Matrix.multiply([translation_matrix_grow_shrink_3, grow_shrink_3]); 
        this.models.slide3[0].transform = transform_final_grow_shrink_3;

        //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

        let size_x_4 = this.models.slide3[1].size_x;
        let size_y_4 = this.models.slide3[1].size_y;
        let s_x_4 = this.models.slide3[1].s_x + size_x_4 * delta_time / 1000;
        let s_y_4 = this.models.slide3[1].s_y + size_y_4 * delta_time / 1000;
        if (s_x_4 > this.models.slide3[1].magnitude) {
            size_x_4 = -1 * size_x_4;
            size_y_4 = -1 * size_y_4;
            s_x_4 = this.models.slide3[1].s_x + (size_x_4 * delta_time / 1000); 
            s_y_4 = this.models.slide3[1].s_y + (size_y_4 * delta_time / 1000);
            this.models.slide3[1].size_x = size_x_4;
            this.models.slide3[1].size_y = size_y_4;
        } else if (s_x_4 < 0) {
            size_x_4 = -1 * size_x_4;
            size_y_4 = -1 * size_y_4;
            s_x_4 = this.models.slide3[1].s_x + (size_x_4 * delta_time / 1000); 
            s_y_4 = this.models.slide3[1].s_y + (size_y_4 * delta_time / 1000);
            this.models.slide3[1].size_x = size_x_4;
            this.models.slide3[1].size_y = size_y_4;
        }

        this.models.slide3[1].s_x = s_x_4;
        this.models.slide3[1].s_y = s_y_4;

        let grow_shrink_4 = CG.mat3x3Scale(new Matrix(3, 3), s_x_4, s_y_4);
        let translation_matrix_grow_shrink_4 = CG.mat3x3Translate(new Matrix(3, 3), 200, 300); 
        let transform_final_grow_shrink_4 = Matrix.multiply([translation_matrix_grow_shrink_4, grow_shrink_4]); 
        this.models.slide3[1].transform = transform_final_grow_shrink_4;


        //++++++++++++++++++++++++++++++++++++++++++++++++++++++++

        let size_x_5 = this.models.slide3[2].size_x; 
        let size_y_5 = this.models.slide3[2].size_y;
        let s_x_5 = this.models.slide3[2].s_x + size_x_5 * delta_time / 1000;
        let s_y_5 = this.models.slide3[2].s_y + size_y_5 * delta_time / 1000;
        if (s_x_5 > this.models.slide3[2].magnitude) {
            size_x_5 = -1 * size_x_5;
            size_y_5 = -1 * size_y_5;
            s_x_5 = this.models.slide3[2].s_x + (size_x_5 * delta_time / 1000); 
            s_y_5 = this.models.slide3[2].s_y + (size_y_5 * delta_time / 1000);
            this.models.slide3[2].size_x = size_x_5;
            this.models.slide3[2].size_y = size_y_5;
        } else if (s_x_5 < 0) {
            size_x_5 = -1 * size_x_5;
            size_y_5 = -1 * size_y_5;
            s_x_5 = this.models.slide3[2].s_x + (size_x_5 * delta_time / 1000);
            s_y_5 = this.models.slide3[2].s_y + (size_y_5 * delta_time / 1000);
            this.models.slide3[2].size_x = size_x_5;
            this.models.slide3[2].size_y = size_y_5;
        }

        this.models.slide3[2].s_x = s_x_5;
        this.models.slide3[2].s_y = s_y_5;

        let grow_shrink_5 = CG.mat3x3Scale(new Matrix(3, 3), s_x_5, s_y_5);
        let translation_matrix_grow_shrink_5 = CG.mat3x3Translate(new Matrix(3, 3), 400, 300); 
        let transform_final_grow_shrink_5 = Matrix.multiply([translation_matrix_grow_shrink_5, grow_shrink_5]); 
        this.models.slide3[2].transform = transform_final_grow_shrink_5;

        // ------------------------------------
        // Part 2: Moving Polygons
        // ------------------------------------
        let theta3 = 50;
        let theta_new3 = theta3 * time / 100000;
        let scale_factor = 0.6; 
        let rotation3 = CG.mat3x3Rotate(new Matrix(3, 3), theta_new3);
        let scaling3 = CG.mat3x3Scale(new Matrix(3, 3), scale_factor, scale_factor);
        let translation_matrix3 = CG.mat3x3Translate(new Matrix(3, 3), 200, 500);

        let transform_final3 = Matrix.multiply([translation_matrix3, scaling3, rotation3]);
        this.models.slide3[4].transform = transform_final3;

        // ------------------------------------

        let theta4 = -50;
        let theta_new4 = theta4 * time / 100000;
        let scale_factor1 = 0.6; 
        let rotation4 = CG.mat3x3Rotate(new Matrix(3, 3), theta_new4);
        let scaling4 = CG.mat3x3Scale(new Matrix(3, 3), scale_factor1, scale_factor1);
        let translation_matrix4 = CG.mat3x3Translate(new Matrix(3, 3), 600, 100);

        let transform_final4 = Matrix.multiply([translation_matrix4, scaling4, rotation4]);
        this.models.slide3[5].transform = transform_final4;

        // ------------------------------------
        // Bouncing Ball
        // ------------------------------------

        let velocity_x1 = this.models.slide3[6].velocity_x;
        let velocity_y1 = this.models.slide3[6].velocity_y;
        
        let t_x1 = this.models.slide3[6].t_x+ velocity_x1 * delta_time/1000;
        let t_y1 = this.models.slide3[6].t_y + velocity_y1 * delta_time/1000;

        if (t_x1 > this.canvas.width-50) {
            velocity_x1 = -1*velocity_x1;
            t_x1 = this.models.slide3[6].t_x + (velocity_x1 * delta_time/1000);
            this.models.slide3[6].velocity_x = velocity_x1;
        } else if (t_x1 < 50) {
            velocity_x1 = -1*velocity_x1;
            t_x1 = this.models.slide3[6].t_x + (velocity_x1 * delta_time/1000);
            this.models.slide3[6].velocity_x = velocity_x1;
        } else if (t_y1 > this.canvas.height-50) {
            velocity_y1 = -1*velocity_y1;
            t_y1 = this.models.slide3[6].t_y + (velocity_y1 * delta_time/1000);
            this.models.slide3[6].velocity_y = velocity_y1;
        } else if (t_y1 < 50) {
            velocity_y1 = -1*velocity_y1;
            t_y1 = this.models.slide3[6].t_y + (velocity_y1 * delta_time/1000);
            this.models.slide3[6].velocity_y = velocity_y1;
        }
        this.models.slide3[6].t_x = t_x1;
        this.models.slide3[6].t_y = t_y1;

        let transform1 = CG.mat3x3Translate(new Matrix(3,3), t_x1, t_y1);
        this.models.slide3[6].transform = transform1;
    }
    
    
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
        let centerX = this.models.slide0[0].t_x;
        let centerY = this.models.slide0[0].t_y; 
        let radius = 50;
        let vertices = [];
        for (let angle = 0; angle < 2 * Math.PI; angle += 0.01) {
            let x = centerX + radius * Math.cos(angle);
            let y = centerY + radius * Math.sin(angle);
            vertices.push(CG.Vector3(x, y, 1));
        }
        this.drawConvexPolygon(vertices, teal);
    }

    drawSlide1() {
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
    }

    //
    drawSlide2() {
        let color1 = [200, 228, 128, 255];
        let vertices = [];
        for (let i=0; i < this.models.slide2[0].origin.length; i++) {
            let new_vertex = Matrix.multiply([this.models.slide2[0].transform, this.models.slide2[0].origin[i]]);
            vertices.push(new_vertex);
        }
        this.drawConvexPolygon(vertices, color1);

        let color2 = [100,200,100,255];
        let vertices_2 = [];
        for (let i=0; i < this.models.slide2[1].origin.length; i++) {
            let new_vertex = Matrix.multiply([this.models.slide2[1].transform, this.models.slide2[1].origin[i]]);
            vertices_2.push(new_vertex);
        }
        this.drawConvexPolygon(vertices_2, color2);
    }

    drawSlide3() {
        // TODO: get creative!
        //   - animation should involve all three basic transformation types
        //     (translation, scaling, and rotation)
        let color1 = [200, 228, 128, 255];
        let vertices = [];
        for (let i=0; i < this.models.slide3[0].origin.length; i++) {
            let new_vertex = Matrix.multiply([this.models.slide3[0].transform, this.models.slide3[0].origin[i]]);
            vertices.push(new_vertex);
        }
        this.drawConvexPolygon(vertices, color1);

        let color3 = [0, 0, 255, 255];
        let vertices3 = [];
        for (let i=0; i < this.models.slide3[1].origin.length; i++) {
            let new_vertex = Matrix.multiply([this.models.slide3[1].transform, this.models.slide3[1].origin[i]]);
            vertices3.push(new_vertex);
        }
        this.drawConvexPolygon(vertices3, color3);  
        
        let color4 = [0, 255, 255, 255];
        let vertices4 = [];
        for (let i=0; i < this.models.slide3[2].origin.length; i++) {
            let new_vertex = Matrix.multiply([this.models.slide3[2].transform, this.models.slide3[2].origin[i]]);
            vertices4.push(new_vertex);
        }
        this.drawConvexPolygon(vertices4, color4);   

        //------------------------------------
        // Spinning Polygon
        //------------------------------------
        let vertices_four = [];
        for (let i = 0; i < this.models.slide3[4].vertices.length; i++) {
            let new_vertex = Matrix.multiply([this.models.slide3[4].transform, this.models.slide3[3].origin[i]]);
            vertices_four.push(new_vertex);
        }
        this.drawConvexPolygon(vertices_four, [255, 0, 0, 255]);

        let vertices_five = [];
        for (let i = 0; i < this.models.slide3[5].vertices.length; i++) {
            let new_vertex = Matrix.multiply([this.models.slide3[5].transform, this.models.slide3[3].origin[i]]);
            vertices_five.push(new_vertex);
        }
        this.drawConvexPolygon(vertices_five, [255, 0, 0, 255]);

        //------------------------------------
        // CIRCLE
        //------------------------------------

        let teal = [0, 128, 128, 255];
        let centerX = this.models.slide3[6].t_x;
        let centerY = this.models.slide3[6].t_y; 
        let radius = 50;
        let vertices_circle = [];
        for (let angle = 0; angle < 2 * Math.PI; angle += 0.01) {
            let x = centerX + radius * Math.cos(angle);
            let y = centerY + radius * Math.sin(angle);
            vertices_circle.push(CG.Vector3(x, y, 1));
        }
        this.drawConvexPolygon(vertices_circle, teal);
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


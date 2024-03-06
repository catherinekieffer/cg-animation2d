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

        this.models = {
            slide0: [
                // example model (diamond) -> should be replaced with actual model
                {
                    vertices: [
                        CG.Vector3(400, 150, 1), //this is the point, calling Vector3 is turning the point into a matrix
                        CG.Vector3(500, 300, 1),
                        CG.Vector3(400, 450, 1),
                        CG.Vector3(300, 300, 1)
                        //we just add more edges here to be a circle!
                    ],
                    transform: null
                }
            ],
            slide1: [
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
                    vertices: [
                        CG.Vector3(400, 150, 1),
                        CG.Vector3(500, 300, 1),
                        CG.Vector3(400, 450, 1),
                        CG.Vector3(300, 300, 1)
                    ],
                    transform: null
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
        let velocity_x = 40;
        let velocity_y = 60;
        
        let t_x = velocity_x * time/1000;
        let t_y = velocity_y * time/1000;

        //if the ball has reached the edge of the canvas, velocity should become 
        // 40, 80, 120 - then if you hit the edge, it would become -120 and it would fold over like a piece of paper
        //   because -120 is wrong - it should be -80 -> so you need to just subract the velocity from itself?
        
        if (t_x > this.canvas.width) {
            t_x = -1*t_x
            console.log(t_x);
        }
        let transform = CG.mat3x3Translate(new Matrix(3,3), t_x, t_y);
        this.models.slide0[0].transform = transform;


        //Slide1 - spinning polygons

        // velocity = revolutions/second and direction! - velocity is basically theta, correcT?

        let theta = 10;
        let theta_new = theta*time/100000;

        let spin_polygon_1_transform = CG.mat3x3Rotate(new Matrix(3,3), theta_new);
        this.models.slide1[0].transform = spin_polygon_1_transform;
        // console.log(this.models.slide1[0].transform);


        //this.models.slide1[1].transform = transform
        //this.models.slide1[2].transform = transform

        //Slide2 - Grow/shrink
        let sx = .1;
        let sy= .1;

        let s_x = sx*time/1000;
        let s_y = sy*time/1000;

        let grow_shrink_1_transform = CG.mat3x3Scale(new Matrix(3,3), s_x, s_y);
        this.models.slide2[0].transform = grow_shrink_1_transform;
        console.log(this.models.slide2[0].transform);

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
        // console.log(this.models.slide0[0].vertices[0])
        // console.log(this.models.slide0[0].transform)

        let vertices = [];
        for (let i=0; i < this.models.slide0[0].vertices.length; i++) {
            let new_vertex = Matrix.multiply([this.models.slide0[0].transform, this.models.slide0[0].vertices[i]]);
            vertices.push(new_vertex);
        }
        this.drawConvexPolygon(vertices, teal);
    }

    
    drawSlide1() {
        // TODO: draw at least 3 polygons that spin about their own centers
        //   - have each polygon spin at a different speed / direction

        let teal = [0, 128, 128, 255];

        let vertices_one = [];
        for (let i=0; i < this.models.slide1[0].vertices.length; i++) {
            // console.log(i);
            // console.log(this.models.slide1[0].transform);
            let new_vertex = Matrix.multiply([this.models.slide1[0].transform, this.models.slide1[0].vertices[i]]);
            vertices_one.push(new_vertex);
        }
        this.drawConvexPolygon(vertices_one, teal);


        let vertices_two = [];
        for (let i=0; i < this.models.slide1[0].vertices.length; i++) {
            
        }

        for (let i=0; i < this.models.slide1[0].vertices.length; i++) {
            
        }

        // this.drawConvexPolygon(this.models.slide1[1].vertices, teal);
        // this.drawConvexPolygon(this.models.slide1[2].vertices, teal);
        
    }

    //
    drawSlide2() {
        // TODO: draw at least 2 polygons grow and shrink about their own centers
        //   - have each polygon grow / shrink different sizes
        //   - try at least 1 polygon that grows / shrinks non-uniformly in the x and y directions

        let teal = [0, 128, 128, 255];

        let vertices_one = [];
        for (let i=0; i < this.models.slide2[0].vertices.length; i++) {
            console.log(i);
            // console.log(this.models.slide2[0].transform);
            let new_vertex = Matrix.multiply([this.models.slide2[0].transform, this.models.slide2[0].vertices[i]]);
            vertices_one.push(new_vertex);
            console.log(vertices_one);
        }
        this.drawConvexPolygon(vertices_one, teal);

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



// function main () {
//     animate(Date.now());
// }
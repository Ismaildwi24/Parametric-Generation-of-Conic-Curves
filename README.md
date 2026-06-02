# Parametric Generation of Conic Curves 📐💻

This project is a practical implementation of the Computer Graphics course material (Semester 4), focusing on the generation of conic curves (Conic Sections) using parametric representation. Unlike implicit Cartesian functions, parametric equations offer high flexibility for rendering curves accurately and efficiently in computer graphics.

## 📌 Theoretical Background

Conic Sections are curves formed when a flat plane intersects a double cone. The resulting visual shape depends entirely on the slant angle of the intersecting plane relative to the cone's axis. 

Why use parametric representation over standard implicit functions?
* **Loop Efficiency**: Allows the rendering process to be executed step-by-step efficiently by changing only a single parameter variable (e.g., $t$ or $\theta$).
* **Error-Free**: Mathematically avoids division-by-zero errors or the appearance of imaginary values, which are common weaknesses in implicit Cartesian equations.
* **Smooth Control**: Point density (resolution) can be easily adjusted by modifying the delta step of the parameter.

## 📐 Curve Equations Summary

Below are the parametric mathematical formulas implemented in this program's code:

| Curve Type | Parameter | X Equation | Y Equation |
|---|---|---|---|
| **Circle** | $\theta \in [0, 2\pi]$ | $x = xc + r \cdot \cos(\theta)$ | $y = yc + r \cdot \sin(\theta)$ |
| **Ellipse** | $\theta \in [0, 2\pi]$ | $x = xc + a \cdot \cos(\theta)$ | $y = yc + b \cdot \sin(\theta)$ |
| **Parabola** | $t \in [t1, t2]$ | $x = xp + a \cdot t^2$ | $y = yp + 2 \cdot a \cdot t$ |
| **Hyperbola** | $\theta \in (-\pi/2, \pi/2)$ | $x = xc + a \cdot \sec(\theta)$ | $y = yc + b \cdot \tan(\theta)$ |

## ✨ Program Features
* **Visual Resolution Analysis**: The program displays two graphics windows side-by-side to compare low-resolution curves (large/coarse parameter step) with high-resolution ones (small/fine parameter step).
* **Data Logging**: Prints a tabular list of $(x, y)$ point coordinates generated from the iteration calculation process directly to the console.
* **Detailed Analytic Visualization**: Displays coordinate value text directly next to the points on the graph (specifically in low-resolution mode) and renders crosshair lines that precisely intersect the curve's center point.
* **Dark Mode Theme**: Renders graphics using a dark background with a contrasting color palette to ensure the visualization remains sharp, modern, and easy to analyze.

## 🗂️ Repository Structure
This repository consists of 4 independent Jupyter Notebook-based programs:
* `Lingkaran.ipynb` - Symmetrical perfect circle curve generator.
* `Elips.ipynb` - Ellipse curve generator using two distance parameters (horizontal and vertical semi-axes).
* `Parabola.ipynb` - Single open curve generator based on vertex definition.
* `Hiperbola.ipynb` - Generator for a curve with two separate branches using the implementation of secant and tangent trigonometric equations.

## 🛠️ Technologies Used
* **Python 3**: The main programming language for computation.
* **Jupyter Notebook (`.ipynb`)**: Interactive development environment.
* **NumPy**: Used to create parameter ranges (*arange*) and perform trigonometric calculations (*cos, sin, tan*).
* **Matplotlib**: Used for 2D graphics rendering and plotting points to the screen.

## 🚀 How to Run

1. Ensure you have **Python** and **Jupyter Notebook** installed on your computer.
2. Clone this repository via your terminal:
   `git clone https://github.com/Ismaildwi24/Parametric-Generation-of-Conic-Curves.git`
3. Navigate your terminal directory into the project folder:
   `cd Parametric-Generation-of-Conic-Curves`
4. Install the required libraries if you don't have them yet:
   `pip install numpy matplotlib`
5. Open Jupyter Notebook:
   `jupyter notebook`
6. Open one of the files, for example `Lingkaran.ipynb`, run the code cell (`Shift + Enter`), and input the mathematical values requested by the interactive prompt.

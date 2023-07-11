---
layout: page
title: Trashcan Detection System for the Blind 
description: A prototype exploring assitive technology for the blind.
img: assets/img/3.jpg
importance: 2
category: work
pdf: trashcan/FinalReport.pdf
---

Formally titled as *Real-Time Trashcan Recognizer and Localizer for the Blind
and Visually Impaired*, this project aims to explore the realm of assistive 
wearable technology for those with disabilities. As someone who love playing
around with photography, film-making, and all-in-all revel in the beauty of
everything in this world, the ability to see is something that I wholeheartedly
value. That is why I decided to prototype something that can help blind people
as I want them to experience the world the way I do to the best of my ability.
By tackling a small problem, in this case how to inform the user how far the
closest trashcan is to them, we learn more about the greater problem at large,
that is informing the user what is in front of them and how far it is from them.

Using haptic motors, a stereoscopic camera, and some machine learning, my
friends and I were able to design a assistive prototype that informed the user the general
direction and distance of the nearest trashcan in front of them. When a trashcan
is detected, a row of haptic motors that represent the direction of where the
trashcan is begins to vibrate in an intensity inversely related to the distance
of the trashcan (i.e. if the trashcan is close, the motors will vibrate stronger).


For those interested in the tech stack, this project utilizes the following:
- Intel Realsense D435 steroscopic camera for obtaining depth. 
- Raspberry Pi to control the wearable device.
- A laptop that receives frames from the D435, processes the images, and sends
  the angle and distance from the camera to the detected trashcan.
- Machine learning library Gluon to create a transfer learning model
- ADE20K segmentation dataset to obtain the proper dataset by converting
  segmented images of trashcans to a trashcan detection dataset through image 
  processing techniques (e.g. connected components).
- Python in both Raspberry Pi and the laptop.


To read more regarding this project, I invite you to click on the PDF icon on
the **top right of the page**.

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.html path="assets/img/trashcan/device.png" title="example image" class="img-fluid rounded z-depth-1" %}
    </div>
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.html path="assets/img/trashcan/haptic-motor-grid.png" title="example image" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    The figure on the left showcases the wearable device, and the figure on the
    right showcases the grid of haptic motors used to inform the user where the
    trashcan is in the their vicinity. The LEDs are used for testing purposes
    and they are turned on when the their respective haptic motor turns on.
</div>
<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.html path="assets/img/trashcan/testing.png" title="example image" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    The prototype in action. Because we did not create a casing for the camera,
    the tester is holding on to the camera in her hand.
</div>

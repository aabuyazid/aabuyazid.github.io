---
layout: page
title: Crowdsource Study and Predictor of Compressed Picture Quality 
description: Optimizing the tradeoffs between image quality and compression through human eyes.
img: assets/img/UT.jpg
importance: 1
category: work
slides: crowdsource/final-presentation.pdf
pdf: crowdsource/system-design-report.pdf
---

It is no question just how ubiquitous technology has become in today's age.
We are exposed to an astounding number of digital images and video either
through our beloved films, video games, and even pesky ads that 
pervades our social media feeds. While this is an interesting development 
regarding our evolution as a species, in an engineering perspective, this poses
a serious data concern in terms of storage and transmission. Without a way to
reduce the amount of data we use to store these images and videos, the 
energy and silicon used will be unsustainable in the near future as more images
and videos are uploaded to the internet. As such, this project will tackle this
problem and aim to minimize the data used for a given image and maximize its
image quality. That is, the project will find the largest JPEG quantization parameter
for a given image such that if any more compression is done onto the image,
there will be a stark difference in the quality of the image.

Previous works have used metrics defined by the images quantitative properties
(e.g. PSNR, SSIM) to determine the quality of an image. There are two flaws to
this technique. Firstly, using this metric requires the compressed image to be
compared with the the original (or pristine) image. Not only does this technique
stores two copies of the same image of varying quality, but it most cases, the
pristine image does not exist as many images in the internet go through an 
innummerable amount of transformations (e.g. other compression passes,
downscaling, etc.). Therefore, we do not solve the data issue, and these metrics
cannot give us an accurate conclusion regarding the compressed image's quality.
Secondly, metrics that compute a result based on quantatitive information only
approximate the quality perception of real human beings. What this project aims
to do is **capture how humans perceive image quality and compress an image
accordingly**. 

<div class="row">
    <div class="col-sm-6 mt-3 mt-md-0">
        {% include figure.html path="assets/img/crowdsource/system-diagram.png" title="example image" class="img-fluid rounded z-depth-1" %}
    </div>
    <div class="col-sm-5 mt-3 mt-md-0">
        {% include figure.html path="assets/img/crowdsource/task.png" title="example image" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    The figure on the left showcases the system design of the project. The
    figure on the right showcases the task that the workers at Amazon MTurk
    completes for our data collection.
</div>

As the project requires a dataset of human decisions, the main method of data collection will be
through Amazon's Mechanical Turk (MTurk), which is a crowdsourcing platform that involves
the distribution of a virtual task to a large human workforce. The task will allow workers to
control the quality of the images through a real-time slider that compresses the image according
to the slider value so that they can determine the perceived optimal point of compression. The
collected dataset will be fed into a neural network that we will construct, customize, and train so
that the model can learn and eventually automatically predict the optimal quantization parameter
for any input image.

This project's tech-stack:
- Amazon MTurk, Amazon S3, and Amazon AWS
- JavaScript for creating the MTurk tasks
- PyTorch for creating and training transfer learning image models
- High-Performance Computing for training the models

To read more regarding this project, I invite you to click on the PDF icon or
the presentation icon **on the top right of the page**.

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.html path="assets/img/crowdsource/GUI.png" title="example image" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    The graphical user interface of the project.
</div>

# render-performance Specification

## Purpose

Defines the per-frame work the running scene is allowed to do and how that work
scales down on low-powered devices, so the site stays smooth and does not drain
battery animating things no visitor is looking at.

## Requirements

### Requirement: Animated surfaces are only redrawn when visible

A surface whose appearance is generated each frame SHALL only be regenerated and
re-uploaded while it is near enough to the camera to be seen. Surfaces far from the
camera MUST NOT consume per-frame drawing or upload cost.

#### Scenario: The camera is far from an animated surface

- **WHEN** the camera is several stations away from a station carrying an animated
  surface
- **THEN** that surface is neither redrawn nor re-uploaded
- **AND** the scene continues to render normally

#### Scenario: The camera approaches an animated surface

- **WHEN** the camera reaches or approaches a station carrying an animated surface
- **THEN** that surface resumes animating
- **AND** it shows current content rather than a stale frame from when it stopped

#### Scenario: Animated surfaces update at a bounded rate

- **WHEN** an animated surface is visible
- **THEN** it is regenerated at a reduced rate rather than on every rendered frame
- **AND** its motion still reads as continuous

### Requirement: The low quality tier scales down all major render cost

The device quality tier SHALL govern every significant per-frame cost, not only
output resolution and optional visual effects. A device placed in the low tier MUST
NOT pay full cost for any major render pass.

#### Scenario: A low-tier device renders the scene

- **WHEN** a device is placed in the low quality tier
- **THEN** shadow rendering is reduced in cost along with resolution and optional
  effects
- **AND** the scene remains recognisably the same composition

#### Scenario: A high-tier device renders the scene

- **WHEN** a device is placed in the high quality tier
- **THEN** full quality shadows and optional effects are applied

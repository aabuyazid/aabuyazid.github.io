# scene-bootstrap Specification

## Purpose

Defines what a visitor sees while the site starts up and when it cannot start at
all: which assets are allowed to delay the first render, and how the site degrades
to a fully readable document when the scene is unavailable.

## Requirements

### Requirement: Decorative assets do not block startup

Startup SHALL NOT wait indefinitely on any asset that is decorative. An asset whose
absence the scene already tolerates MUST NOT be able to hold the visitor on the
loading indicator.

#### Scenario: A decorative image is slow or stalled

- **WHEN** a decorative scene texture has not loaded within a short bounded time
- **THEN** startup proceeds without it
- **AND** the scene renders using its defined fallback appearance for that asset
- **AND** the loading indicator is dismissed

#### Scenario: A decorative image fails outright

- **WHEN** a decorative scene texture cannot be loaded at all
- **THEN** startup completes and the scene renders
- **AND** no error is shown to the visitor

#### Scenario: Assets load normally

- **WHEN** scene textures load promptly
- **THEN** they are used as intended, with no degradation in appearance

### Requirement: The site is fully readable without the scene

When the three dimensional scene cannot run, the site SHALL present every station's
complete content as a plain readable document.

#### Scenario: The browser cannot provide WebGL

- **WHEN** a visitor's browser cannot provide a WebGL context
- **THEN** the page presents every station's content as a single readable document
- **AND** the scene canvas, scroll driver, and scene-only controls are hidden

#### Scenario: The scene fails to start

- **WHEN** startup raises an error for any reason
- **THEN** the page presents the same fully readable document
- **AND** the loading indicator is dismissed

#### Scenario: A station address in the readable document

- **WHEN** a visitor loads an address identifying a station and the readable document
  is shown
- **THEN** that station's section is reachable at that address

### Requirement: Reduced motion is honoured

When the visitor has asked for reduced motion, the site SHALL NOT animate the camera
journey or apply idle drift.

#### Scenario: Visitor prefers reduced motion

- **WHEN** a visitor who has requested reduced motion navigates to a station
- **THEN** the camera arrives at that station without an animated fly-through
- **AND** the camera does not drift while idle

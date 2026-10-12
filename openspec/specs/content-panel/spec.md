# content-panel Specification

## Purpose

Defines how the readable content panel behaves for every visitor, including those
using a keyboard or a screen reader: how it opens and closes, where focus goes, and
how it stays in step with the camera without disrupting assistive technology.

## Requirements

### Requirement: The panel is the readable source of truth

The content panel SHALL carry the full text of the station it shows. The three
dimensional scene is presentation only and MUST NOT be the sole carrier of any
content.

#### Scenario: Station content is reachable without the scene

- **WHEN** a visitor opens any station's panel
- **THEN** the panel contains that station's complete text, links, and figures
- **AND** none of that content exists only inside the scene

### Requirement: The panel closes on Escape

The panel SHALL close when the visitor presses Escape while it is open.

#### Scenario: Visitor presses Escape

- **WHEN** the panel is open and the visitor presses Escape
- **THEN** the panel closes
- **AND** focus returns to the control that opened it

### Requirement: Keyboard focus is not confined to the panel

The panel is not a modal dialog: it does not cover the page and does not block the
controls beside it. Keyboard focus SHALL therefore be allowed to leave the panel
while it is open, so every visible control stays reachable by keyboard.

#### Scenario: Keyboard user reaches the station navigation while the panel is open

- **WHEN** the panel is open and a keyboard user moves focus forward past the end of
  the panel's contents
- **THEN** focus reaches the station navigation and the other visible page controls
- **AND** the visitor does not have to close the panel first

#### Scenario: Keyboard user can move backward out of the panel

- **WHEN** the panel is open and a keyboard user moves focus backward from the first
  control inside the panel
- **THEN** focus leaves the panel rather than cycling to its last control

### Requirement: Changing stations preserves keyboard focus

When the panel's content is replaced because the camera reached a different station,
the visitor's focus SHALL NOT be discarded. Controls that persist across stations
MUST remain the same focusable elements.

#### Scenario: Focused control survives a station change

- **WHEN** a keyboard user has focused the panel's close control and then scrolls so
  the camera reaches the next station
- **THEN** the panel shows the new station's content
- **AND** focus is still on the close control
- **AND** the next forward focus movement continues from that control, not from the
  top of the page

### Requirement: Camera movement does not re-announce the panel

Replacing the panel's content as the camera travels SHALL NOT cause assistive
technology to read the panel's full contents again. The panel MUST NOT be treated as
a live region that announces its own changes.

#### Scenario: Screen reader user scrolls with the panel open

- **WHEN** a screen reader user scrolls past several stations with the panel open
- **THEN** the panel's full article is not read aloud again on each station change
- **AND** the user's current reading position is not interrupted

#### Scenario: Screen reader user opens a station

- **WHEN** a screen reader user opens a station's panel
- **THEN** focus moves into the panel so the content can be read from its start

### Requirement: The open station is reflected in the address

While the panel is open, the address SHALL identify the station being shown, and
that address SHALL reopen the same station directly.

#### Scenario: Camera reaches a new station with the panel open

- **WHEN** the camera reaches a different station while the panel is open
- **THEN** the panel shows that station and the address identifies it
- **AND** no new browser history entry is added

#### Scenario: Visitor opens a station address directly

- **WHEN** a visitor loads an address identifying a station
- **THEN** that station's panel opens with its content
- **AND** the camera is positioned at that station

#### Scenario: Visitor closes the panel

- **WHEN** the visitor closes the panel
- **THEN** the address no longer identifies a station
